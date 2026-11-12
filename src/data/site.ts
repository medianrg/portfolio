// All the words on the site that are not inside a project live here.

export const site = {
  name: 'Mihai Mări',
  role: 'Product designer · since 2003',
  location: 'Timișoara, Romania',
  description:
    'Mihai Mări is a full-stack product designer from Timișoara, designing interfaces since 2003: from UX architecture to refined visuals and expressive brand moments.',

  // Home
  kicker: 'Hey, I’m Mihai.',
  headline: 'From UX architecture to refined visuals and expressive brand moments.',

  // What the companion says. `hello` is the line on arrival; `lines` are what it says
  // when someone clicks it on the home page, one after another. Keep each under ~32 characters
  // so it fits inside the capsule on a phone.
  hello: 'Hi. I’ll show you around.',
  lines: ['I’m the menu. Yes, it has eyes.', 'OK, I’m a button. I get it.', 'Still here. No pressure.'],

  // Browser tab titles.
  titles: {
    home: 'Mihai Mări — Product designer',
    work: 'Work — Mihai Mări',
    about: 'About — Mihai Mări',
    contact: 'Contact — Mihai Mări',
  },

  about: {
    lead: 'I’m Mihai, a full-stack product designer from Timișoara. I’ve been designing interfaces since 2003, starting with some of the first Windows Mobile UIs.',
    paragraphs: [
      {
        text: 'Since then: SaaS, healthcare, fintech and real estate, from UX architecture to visuals and brand. I’ve also led design teams in two outsourcing companies. Mentoring, regular 1:1s, getting a team through an acquisition.',
        muted: true,
      },
      {
        text: 'Right now I’m a UX researcher at 3Pillar Global. On the side, I build quick MVPs with Lovable, mostly to learn and explore ideas.',
        muted: false,
      },
      {
        text: 'No double diamonds here. Just real work, real Figma files and the messy iterations too. I don’t delete stuff.',
        muted: true,
      },
    ],
    experience: [
      { years: '[start] — now', company: '3Pillar Global', role: 'UX Researcher' },
      { years: '2026 — now', company: 'Softbinator', role: 'UI/UX Designer' },
      { years: '2024 — 2025', company: 'Smilecloud', role: 'Product Designer' },
      { years: '2021 — 2024', company: '[e-spres-oh] / Softbinator', role: 'Design Manager' },
      { years: '2019 — 2021', company: '24Digital Signage', role: 'Founder' },
      { years: '2010 — now', company: 'Media nrg Creative Studio', role: 'Founder' },
      { years: '2008 — 2017', company: 'imobiliare.ro', role: 'Product Designer' },
      { years: '2003 — 2008', company: 'V2R · O2 Active UI', role: 'UI/UX' },
    ],
  },

  // Rows in the Contact panel. icon: 'out' = opens elsewhere, 'down' = download.
  contact: [
    { label: 'LinkedIn', value: 'mihai-mari', href: 'https://www.linkedin.com/in/mihai-mari/', icon: 'out' },
    { label: 'Email', value: 'mihai.mari@medianrg.com', href: 'mailto:mihai.mari@medianrg.com', icon: 'out' },
    { label: 'CV', value: 'PDF', href: 'https://personal-doc-site.lovable.app/CV_Mihai_Mari.pdf', icon: 'down' },
  ],
  linkedin: 'https://www.linkedin.com/in/mihai-mari/',

  // While a project has no images yet, its page shows empty tinted areas where they will go.
  // Set to false to hide them.
  showPlaceholders: true,
};

export type Site = typeof site;
