/* ══════════════════════════════════════════════════════════
   STARS* — ATTRIBUTION
   The site is the smart link, so the site has to do the
   smart link's job: know where every outbound click came
   from and which surface sent it.

   Two halves:
     1. Pageviews + custom events  → whichever provider is
        configured below. Nothing is configured yet, so this
        is inert until you paste one key in.
     2. UTM stamping. Runs regardless of provider — it is
        what makes untitled/Spotify/Apple's own dashboards
        attribute the sale back to scratchbradley.com.

   Markup opts in by attribute; no page hard-codes a tracker:
     <a href="…"
        data-track="Buy"        the event name
        data-release="Upgrade You"
        data-surface="landing"> where the click happened
══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── CONFIG ────────────────────────────────────────────
     Fill ONE of these in to switch analytics on.
     Plausible: your domain, exactly as registered.
     Umami:     the website ID from the Umami dashboard.
     Leaving both empty is a supported state — every
     track() below becomes a no-op and nothing 404s.
  ─────────────────────────────────────────────────────── */
  var PLAUSIBLE_DOMAIN = '';           /* e.g. 'scratchbradley.com'          */
  var UMAMI_WEBSITE_ID = '';           /* e.g. '8f2c…'  (used only if no Plausible) */
  var UMAMI_HOST       = 'https://cloud.umami.is';

  /* The canonical name of this property in every report. */
  var UTM_SOURCE = 'scratchbradley.com';

  /* ══ PROVIDER LOADING ══════════════════════════════════ */
  function loadScript(src, attrs) {
    var s = document.createElement('script');
    s.src = src;
    s.defer = true;
    Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
  }

  var provider = null;

  if (PLAUSIBLE_DOMAIN) {
    provider = 'plausible';
    /* The `manual` variant is deliberate: it lets the release pages
       report a clean pathname even when the URL carries UTMs of its own. */
    loadScript('https://plausible.io/js/script.tagged-events.outbound-links.js',
               { 'data-domain': PLAUSIBLE_DOMAIN });
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  } else if (UMAMI_WEBSITE_ID) {
    provider = 'umami';
    loadScript(UMAMI_HOST + '/script.js', { 'data-website-id': UMAMI_WEBSITE_ID });
  }

  /* ══ EVENTS ════════════════════════════════════════════
     One entry point. Never throws, never blocks a click —
     an ad-blocked or unconfigured tracker must not be able
     to stop someone reaching the buy page.
  ═══════════════════════════════════════════════════════ */
  function track(name, props) {
    try {
      if (provider === 'plausible' && window.plausible) {
        window.plausible(name, { props: props || {} });
      } else if (provider === 'umami' && window.umami) {
        window.umami.track(name, props || {});
      }
    } catch (e) { /* analytics never breaks the page */ }
  }

  /* ══ UTM STAMPING ══════════════════════════════════════
     Applied at load, not at click, so a middle-click, a
     long-press "copy link", or a share carries the same
     attribution a normal click would.
  ═══════════════════════════════════════════════════════ */
  function stamp(a) {
    var release = a.getAttribute('data-release') || 'site';
    var surface = a.getAttribute('data-surface') || 'unknown';
    var slug    = release.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return; }

    /* Only stamp links that actually leave the site. */
    if (url.origin === location.origin) return;

    var p = url.searchParams;
    if (!p.has('utm_source')) {
      p.set('utm_source',   UTM_SOURCE);
      p.set('utm_medium',   'owned');
      p.set('utm_campaign', slug);
      p.set('utm_content',  surface);
      a.href = url.toString();
    }
  }

  function wire() {
    var links = document.querySelectorAll('a[data-track]');
    for (var i = 0; i < links.length; i++) stamp(links[i]);
  }

  /* Delegated so blocks rendered after load (the catalog grid,
     the release detail panel) are covered without re-wiring. */
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el) return;
    track(el.getAttribute('data-track'), {
      release: el.getAttribute('data-release') || '—',
      surface: el.getAttribute('data-surface') || '—',
      service: el.getAttribute('data-service') || 'untitled'
    });
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  /* ══ DEPTH ═════════════════════════════════════════════
     A release page's real question is "did they get far
     enough to see the buy button." Fires once per page.
  ═══════════════════════════════════════════════════════ */
  function watchOnce(selector, eventName, props) {
    var el = document.querySelector(selector);
    if (!el || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        track(eventName, props);
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(el);
  }

  /* ══ PROGRAMMATIC OUTBOUND ═════════════════════════════
     For the shop's music cards, which open their link from
     an onclick rather than an <a>. Stamps the same UTMs the
     markup path gets, fires the same event, then opens.
     The window.open runs regardless of tracking outcome.
  ═══════════════════════════════════════════════════════ */
  function out(url, o) {
    o = o || {};
    var slug = (o.release || 'site').toLowerCase()
                 .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var href = url;
    try {
      var u = new URL(url, location.href);
      if (u.origin !== location.origin && !u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source',   UTM_SOURCE);
        u.searchParams.set('utm_medium',   'owned');
        u.searchParams.set('utm_campaign', slug);
        u.searchParams.set('utm_content',  o.surface || 'unknown');
        href = u.toString();
      }
    } catch (e) { /* fall back to the raw url */ }

    track(o.event || 'Stream', {
      release: o.release || '—',
      surface: o.surface || '—',
      service: o.service || 'untitled'
    });
    window.open(href, '_blank', 'noopener');
  }

  window.Stars = window.Stars || {};
  window.Stars.out       = out;
  window.Stars.track     = track;
  window.Stars.stampAll  = wire;
  window.Stars.watchOnce = watchOnce;
  window.Stars.provider  = provider;
})();
