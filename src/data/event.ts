export const event = {
  name: 'Science Expo 2026',
  organizer: 'EGS Pillay Group of Institutions',
  date: '24 October 2026',
  dateISO: '2026-10-24',
  time: '09:30–16:30 IST',
  venue: 'EGS Pillay Campus',
  location: 'Nagapattinam, Tamil Nadu',
  address:
    'EGS Pillay Campus, Nagapattinam, Tamil Nadu. Exact gate and hall details to be confirmed.',
  registration: 'Offline registration only',
  audience: 'Students & visitors',
  email: 'expo@example.org',
  phone: '00000 00000',
  institutionUrl: 'https://www.egspec.org/',
  offlineDesk: 'Registration help desk · exact campus location to be announced',
  offlineHours: 'Registration desk hours to be announced',
  offlineRequirements: [
    'Student or institution ID',
    'Printed project abstract and team details',
    'Faculty mentor contact details',
  ],
  previewMode: true,
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=10.803727755112378%2C79.83338948965753',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://science-expo.example.org',
  description:
    'Explore Science Expo 2026 featuring student innovation across space, satellite technology, racing engineering, aerodynamics, robotics, physics, mathematics and engineering.',
  dates: [
    { label: 'Project submissions', value: '01–10 October 2026' },
    { label: 'Selection notification', value: '15 October 2026' },
    { label: 'Exhibit setup', value: '23 October 2026' },
    { label: 'Expo day', value: '24 October 2026' },
  ],
};
export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Participate', href: '/participate' },
  { label: 'Updates', href: '/updates' },
];
export const exploreNav = [
  { label: 'Science playground', href: '/experience' },
  { label: 'Help desk', href: '/help-desk' },
  { label: 'Expo themes', href: '/themes' },
  { label: 'Projects & exhibits', href: '/projects' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Venue', href: '/venue' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];
