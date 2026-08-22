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
     accent    [primary, secondary] sampled off the cover by tools/accent.ps1
               so each record's page and rack wear the record's own colour.
               Re-run the tool when you add art; never guess these by eye.
     status    'available' | 'soon'
     link      untitled URL, null while unreleased
     linkType  'buy' → the CTA says buy · 'library' → it says stream
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
    accent: ['#ea512e', '#2e7eea'],
    status: 'available',
    link: 'https://untitled.stream/buy/project/NVZR6Foikt80sX1cZs3ew',
    linkType: 'buy',
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
    accent: ['#ea2ea6', '#772eea'],
    status: 'soon',
    link: null,
    linkType: null,
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
    accent: ['#5894ee', '#ee589f'],
    status: 'soon',
    link: null,
    linkType: null,
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
    accent: ['#eebf58', '#ea2e43'],
    status: 'available',
    link: 'https://untitled.stream/buy/project/75hkHSf53LC6m9MoUdAtA',
    linkType: 'buy',
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
    accent: ['#2d68ec', '#f8212e'],
    status: 'available',
    link: 'https://untitled.stream/buy/project/JDEPnFXhxhSBSaxNSzElN',
    linkType: 'buy',
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
    accent: ['#588dee', '#58eedb'],
    status: 'available',
    link: 'https://untitled.stream/library/project/NZVMM3NKhydA7A3nemNxG',
    linkType: 'library',
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
    accent: ['#ea6a2e', '#45ea2e'],
    status: 'available',
    link: 'https://untitled.stream/library/project/9huV2PQNFV599EyUYhODA',
    linkType: 'library',
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
    accent: ['#d8ea2e', '#ee6b58'],
    status: 'available',
    link: 'https://untitled.stream/buy/project/uSGiPOOatSAYuy0fGThNX',
    linkType: 'buy',
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
    accent: ['#8a8f9c', '#5a6070'],
    status: 'available',
    link: 'https://untitled.stream/library/project/NQrbZCfBX8EdlnnKm7VXx',
    linkType: 'library',
    page: null,
    dsp: { apple: null, spotify: null, youtube: null }
  }

];

/* The newest release that is actually out. The home block and the
   music page's front rack both ask for this rather than index [0],
   so a "coming soon" entry can sit at the top of the list without
   becoming the thing the site advertises. */
const LATEST = CATALOG.find(r => r.status === 'available');
