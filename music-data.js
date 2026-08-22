/* ══════════════════════════════════════════════════════════
   STARS* — MUSIC CATALOG
   One record per release, newest first. The music page and
   the home release block both read from here, so putting
   out a single means adding one object at the top and
   nothing else.

   fields
     slug      url-safe id; also the analytics campaign name
     title     as it should read on the shelf
     artist    billing, exactly as credited
     credit    production line, optional
     type      'Album' | 'Single' | 'EP'
     cover     path under assets/
     status    'available' | 'soon'
     link      untitled URL, null while unreleased
     linkType  'buy' → the CTA says buy · 'library' → it says stream
     embed     untitled embed id, or null
     page      dedicated landing page path, or null
     dsp       { apple, spotify, youtube } — null value = still processing
══════════════════════════════════════════════════════════ */
const CATALOG = [

  {
    slug: 'upgrade-you',
    title: 'Upgrade You',
    artist: 'Stars* & SammO',
    credit: 'Produced by Stars*',
    type: 'Single',
    cover: 'assets/upgrade-you.jpg',
    status: 'available',
    link: 'https://untitled.stream/buy/project/NVZR6Foikt80sX1cZs3ew',
    linkType: 'buy',
    embed: '50ViiKxOIUXB',
    page: '/upgrade-you',
    dsp: { apple: null, spotify: null, youtube: null }
  },

  {
    slug: 'body-skin2skin',
    title: 'body skin2skin',
    artist: 'Stars*',
    credit: null,
    type: 'Single',
    cover: 'assets/product14.jpg',
    status: 'soon',
    link: null,
    linkType: null,
    embed: null,
    page: null,
    dsp: { apple: null, spotify: null, youtube: null }
  },

  {
    slug: 'endless',
    title: 'Endless',
    artist: 'Stars*',
    credit: null,
    type: 'Album',
    cover: 'assets/product11.jpg',
    status: 'soon',
    link: null,
    linkType: null,
    embed: null,
    page: null,
    dsp: { apple: null, spotify: null, youtube: null }
  },

  {
    slug: 'let-it-play-out',
    title: 'let it play out!!',
    artist: 'Stars*',
    credit: null,
    type: 'Single',
    cover: 'assets/product13.jpg',
    status: 'available',
    link: 'https://untitled.stream/buy/project/75hkHSf53LC6m9MoUdAtA',
    linkType: 'buy',
    embed: null,
    page: null,
    dsp: { apple: null, spotify: null, youtube: null }
  },

  {
    slug: 'ghost-in-the-city',
    title: 'Ghost In The City (1995)',
    artist: 'Stars*',
    credit: null,
    type: 'Single',
    cover: 'assets/product12.jpg',
    status: 'available',
    link: 'https://untitled.stream/buy/project/JDEPnFXhxhSBSaxNSzElN',
    linkType: 'buy',
    embed: null,
    page: null,
    dsp: { apple: null, spotify: null, youtube: null }
  },

  {
    slug: 'take-it-off',
    title: 'take it off',
    artist: 'Stars*',
    credit: null,
    type: 'Single',
    cover: 'assets/product10.jpg',
    status: 'available',
    link: 'https://untitled.stream/library/project/NZVMM3NKhydA7A3nemNxG',
    linkType: 'library',
    embed: null,
    page: null,
    dsp: { apple: null, spotify: null, youtube: null }
  },

  {
    slug: 'the-lust-we-love',
    title: 'The Lust We Love',
    artist: 'Stars*',
    credit: null,
    type: 'Single',
    cover: 'assets/product2.jpg',
    status: 'available',
    link: 'https://untitled.stream/library/project/9huV2PQNFV599EyUYhODA',
    linkType: 'library',
    embed: null,
    page: null,
    dsp: { apple: null, spotify: null, youtube: null }
  },

  {
    slug: 'pussy-poppin',
    title: 'Pussy Poppin',
    artist: 'Stars*',
    credit: null,
    type: 'Single',
    cover: 'assets/product1.jpg',
    status: 'available',
    link: 'https://untitled.stream/buy/project/uSGiPOOatSAYuy0fGThNX',
    linkType: 'buy',
    embed: null,
    page: null,
    dsp: { apple: null, spotify: null, youtube: null }
  },

  {
    slug: 'heart-of-the-underworld',
    title: 'Heart of the Underworld',
    artist: 'Stars*',
    credit: null,
    type: 'Album',
    cover: 'assets/product9.jpg',
    status: 'available',
    link: 'https://untitled.stream/library/project/NQrbZCfBX8EdlnnKm7VXx',
    linkType: 'library',
    embed: null,
    page: null,
    dsp: { apple: null, spotify: null, youtube: null }
  }

];

/* The newest release that is actually out. The home block and the
   music page's front rack both ask for this rather than index [0],
   so a "coming soon" entry can sit at the top of the list without
   becoming the thing the site advertises. */
const LATEST = CATALOG.find(r => r.status === 'available');
