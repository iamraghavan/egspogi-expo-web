export function GeometricScienceArtwork() {
  return (
    <svg className="hero-art" viewBox="0 0 560 480" role="img" aria-labelledby="science-art-title">
      <title id="science-art-title">
        Geometric science mural: rocket, satellite, planet, race car, aircraft and robot
      </title>
      <defs>
        <pattern id="art-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="#fff" strokeOpacity=".14" />
        </pattern>
      </defs>
      <rect width="560" height="480" fill="#073F91" />
      <rect width="560" height="480" fill="url(#art-grid)" />
      <path d="M0 0h180v180A180 180 0 0 1 0 0" fill="#F7B817" />
      <circle cx="76" cy="64" r="30" fill="#073F91" />
      <path d="M32 125h70M32 137h46" stroke="#073F91" strokeWidth="3" />
      <rect x="392" width="168" height="168" fill="#13A89E" />
      <circle cx="476" cy="84" r="57" fill="#FFF8E8" />
      <ellipse
        cx="476"
        cy="84"
        rx="77"
        ry="20"
        transform="rotate(-30 476 84)"
        fill="none"
        stroke="#073F91"
        strokeWidth="10"
      />
      <circle cx="492" cy="68" r="9" fill="#F7B817" />
      <g transform="translate(222 48) rotate(28 55 85)" className="art-rocket">
        <path d="M55 0C15 40 25 110 25 134h60c0-24 10-94-30-134" fill="#FFF8E8" />
        <path d="M55 0Q35 20 29 45h52Q75 20 55 0" fill="#F45B4F" />
        <circle cx="55" cy="72" r="19" fill="#24BCE2" stroke="#032C68" strokeWidth="8" />
        <path d="M25 94L0 143l25-9M85 94l25 49-25-9" fill="#F45B4F" />
        <path d="M34 143l21 58 21-58" fill="#F7B817" />
        <path d="M47 143l8 29 8-29" fill="#FFF8E8" />
      </g>
      <g transform="translate(34 218) rotate(-25 65 40)">
        <rect x="48" y="13" width="38" height="51" fill="#F7B817" />
        <path d="M0 18h39v43H0zM95 18h39v43H95z" fill="#24BCE2" stroke="#FFF8E8" strokeWidth="2" />
        <path
          d="M13 18v43m13-43v43m82-43v43m13-43v43M0 39h39m56 0h39"
          stroke="#073F91"
          strokeWidth="2"
        />
        <path d="M67 13V0m-9 0h18M57 71q10 18 20 0" fill="none" stroke="#FFF8E8" strokeWidth="3" />
      </g>
      <path d="M0 328h192v152H0z" fill="#F45B4F" />
      <g transform="translate(17 361)">
        <path d="M12 46l18-29h73l27 24h20v27H8V46z" fill="#032C68" />
        <path d="M44 24h46l18 18H33z" fill="#FFF8E8" />
        <circle cx="39" cy="69" r="18" fill="#FFF8E8" />
        <circle cx="118" cy="69" r="18" fill="#FFF8E8" />
        <circle cx="39" cy="69" r="8" fill="#032C68" />
        <circle cx="118" cy="69" r="8" fill="#032C68" />
        <path d="M0 90h155" stroke="#032C68" strokeWidth="3" />
      </g>
      <path d="M208 480V360a76 76 0 0 1 152 0v120" fill="#F7B817" />
      <g transform="translate(230 342)">
        <rect x="6" y="22" width="95" height="65" rx="15" fill="#032C68" />
        <circle cx="32" cy="51" r="9" fill="#FFF8E8" />
        <circle cx="74" cy="51" r="9" fill="#FFF8E8" />
        <path d="M33 71h39M53 0v22M20 98v35m64-35v35" stroke="#032C68" strokeWidth="8" />
        <circle cx="53" cy="0" r="7" fill="#F45B4F" />
        <path d="M28 101h51v32H28z" fill="#032C68" />
      </g>
      <rect x="380" y="188" width="180" height="292" fill="#FFF8E8" />
      <path d="M396 324l145-90-60 132-18-47-67 5z" fill="#073F91" />
      <path d="M463 319l78-85" stroke="#FFF8E8" strokeWidth="3" />
      <path
        d="M409 366q28 55 111 41M409 387q28 55 111 41"
        fill="none"
        stroke="#13A89E"
        strokeWidth="3"
      />
      <circle cx="540" cy="452" r="28" fill="#F7B817" />
      <path d="M194 247h149M194 261h90" stroke="#FFF8E8" strokeOpacity=".55" />
      <circle cx="342" cy="223" r="8" fill="#F45B4F" />
      <path d="M168 188v28m-14-14h28" stroke="#FFF8E8" strokeWidth="3" />
    </svg>
  );
}
