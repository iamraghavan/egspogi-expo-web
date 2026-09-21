BEGIN;
CREATE TABLE IF NOT EXISTS public.expo_cms_meta (key text PRIMARY KEY, value text NOT NULL);
CREATE TABLE IF NOT EXISTS public.expo_cms_admins (id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, email text NOT NULL UNIQUE, enabled boolean NOT NULL DEFAULT true, must_change_password boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS public.expo_cms_sessions (token_hash text PRIMARY KEY, admin_id uuid NOT NULL REFERENCES public.expo_cms_admins(id) ON DELETE CASCADE, csrf text NOT NULL, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS public.expo_cms_login_attempts (bucket text PRIMARY KEY, attempts integer NOT NULL, reset_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS public.expo_cms_documents (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), collection text NOT NULL CHECK(collection IN ('projects','updates','schedule','gallery','teams','faqs','notices','event')), slug text, data jsonb NOT NULL, published_data jsonb, version integer NOT NULL DEFAULT 1, published_version integer, archived boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(collection, slug));
CREATE TABLE IF NOT EXISTS public.expo_cms_revisions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), document_id uuid NOT NULL REFERENCES public.expo_cms_documents(id) ON DELETE CASCADE, version integer NOT NULL, data jsonb NOT NULL, action text NOT NULL, actor text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS public.expo_cms_audit (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), action text NOT NULL, collection text NOT NULL, document_id text NOT NULL, title text NOT NULL, actor text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS public.expo_cms_media (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, mime text NOT NULL, data_base64 text NOT NULL, size integer NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS expo_cms_documents_collection ON public.expo_cms_documents(collection, archived);
CREATE INDEX IF NOT EXISTS expo_cms_revisions_document ON public.expo_cms_revisions(document_id, version DESC);
CREATE INDEX IF NOT EXISTS expo_cms_sessions_expiry ON public.expo_cms_sessions(expires_at);

-- The browser's publishable key cannot read or write CMS tables. Every public read
-- and authenticated write passes through server-side application authorization.
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['expo_cms_meta','expo_cms_admins','expo_cms_sessions','expo_cms_login_attempts','expo_cms_documents','expo_cms_revisions','expo_cms_audit','expo_cms_media'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.expo_cms_save(p_id uuid, p_collection text, p_data jsonb, p_version integer, p_intent text, p_actor text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_doc public.expo_cms_documents; result_doc public.expo_cms_documents; next_version integer; next_slug text;
BEGIN
  IF p_intent NOT IN ('draft','publish','archive','unarchive','restore') THEN RAISE EXCEPTION 'INVALID_INTENT'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('expo-cms-write-' || p_collection));
  SELECT * INTO current_doc FROM public.expo_cms_documents WHERE id = p_id FOR UPDATE;
  IF FOUND THEN
    IF current_doc.collection <> p_collection THEN RAISE EXCEPTION 'NOT_FOUND'; END IF;
    IF current_doc.version <> p_version THEN RAISE EXCEPTION 'VERSION_CONFLICT'; END IF;
    IF p_collection = 'event' AND p_intent IN ('archive','unarchive') THEN RAISE EXCEPTION 'EVENT_REQUIRED'; END IF;
    IF current_doc.archived AND p_intent NOT IN ('unarchive','restore') THEN RAISE EXCEPTION 'ARCHIVED'; END IF;
    IF current_doc.published_data IS NOT NULL AND current_doc.published_data->>'slug' IS DISTINCT FROM p_data->>'slug' THEN RAISE EXCEPTION 'PUBLISHED_SLUG_IMMUTABLE'; END IF;
    next_version := current_doc.version + 1;
  ELSE
    IF p_version <> 0 OR p_intent NOT IN ('draft','publish') THEN RAISE EXCEPTION 'NOT_FOUND'; END IF;
    IF p_collection = 'event' AND EXISTS(SELECT 1 FROM public.expo_cms_documents WHERE collection='event') THEN RAISE EXCEPTION 'EVENT_EXISTS'; END IF;
    next_version := 1;
  END IF;
  next_slug := nullif(p_data->>'slug','');
  INSERT INTO public.expo_cms_documents(id, collection, slug, data, published_data, version, published_version, archived)
  VALUES(p_id,p_collection,next_slug,p_data,CASE WHEN p_intent='publish' THEN p_data ELSE NULL END,next_version,CASE WHEN p_intent='publish' THEN next_version ELSE NULL END,false)
  ON CONFLICT(id) DO UPDATE SET data=p_data, slug=next_slug, version=next_version,
    published_data=CASE WHEN p_intent='publish' THEN p_data ELSE expo_cms_documents.published_data END,
    published_version=CASE WHEN p_intent='publish' THEN next_version ELSE expo_cms_documents.published_version END,
    archived=CASE WHEN p_intent='archive' THEN true WHEN p_intent='unarchive' THEN false ELSE expo_cms_documents.archived END,
    updated_at=now()
  RETURNING * INTO result_doc;
  INSERT INTO public.expo_cms_revisions(document_id,version,data,action,actor) VALUES(p_id,next_version,p_data,p_intent,p_actor);
  INSERT INTO public.expo_cms_audit(action,collection,document_id,title,actor) VALUES(p_intent,p_collection,p_id::text,coalesce(p_data->>'title',p_data->>'question','Event settings'),p_actor);
  RETURN to_jsonb(result_doc);
END $$;
REVOKE ALL ON FUNCTION public.expo_cms_save(uuid,text,jsonb,integer,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.expo_cms_save(uuid,text,jsonb,integer,text,text) TO service_role;

CREATE OR REPLACE FUNCTION public.expo_cms_login_limit(p_bucket text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE total integer;
BEGIN
  DELETE FROM public.expo_cms_login_attempts WHERE reset_at < now() - interval '1 day';
  INSERT INTO public.expo_cms_login_attempts(bucket,attempts,reset_at) VALUES(p_bucket,1,now()+interval '15 minutes')
  ON CONFLICT(bucket) DO UPDATE SET attempts=CASE WHEN expo_cms_login_attempts.reset_at < now() THEN 1 ELSE expo_cms_login_attempts.attempts+1 END,
    reset_at=CASE WHEN expo_cms_login_attempts.reset_at < now() THEN now()+interval '15 minutes' ELSE expo_cms_login_attempts.reset_at END
  RETURNING attempts INTO total;
  RETURN total <= 10;
END $$;
REVOKE ALL ON FUNCTION public.expo_cms_login_limit(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.expo_cms_login_limit(text) TO service_role;

INSERT INTO public.expo_cms_meta(key,value) VALUES('schema_version','1') ON CONFLICT(key) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
