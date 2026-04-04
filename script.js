/* ════════════════════════════════════════
   AUDIO
════════════════════════════════════════ */
const music = document.getElementById("bg-music");
const hoverSounds = [
  document.getElementById("hover-sound-1"),
  document.getElementById("hover-sound-2"),
  document.getElementById("hover-sound-3"),
];

if (music) music.volume = 0.2;
hoverSounds.forEach(s => { if (s) s.volume = 0.15; });

// Start music on first interaction
document.body.addEventListener("click", () => {
  if (music) music.play().catch(() => {});
}, { once: true });

/* ════════════════════════════════════════
   HOVER SOUND — each pillar plays its own
════════════════════════════════════════ */
function playHover(n) {
  const s = hoverSounds[n - 1];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
}

/* ════════════════════════════════════════
   SHOP — smooth scroll to products
════════════════════════════════════════ */
function scrollToShop() {
  const el = document.getElementById("shop");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* ════════════════════════════════════════
   ARCHIVE POPUP
════════════════════════════════════════ */
function archiveAlert() {
  const popup = document.getElementById("archive-popup");
  const inner = document.getElementById("archive-inner");
  if (!popup || !inner) return;

  // Re-trigger the reveal animation each open
  inner.classList.remove("animate");
  void inner.offsetWidth; // force reflow
  inner.classList.add("animate");

  popup.classList.add("active");
}

function closeArchive() {
  const popup = document.getElementById("archive-popup");
  if (popup) popup.classList.remove("active");
}

// Also close on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeArchive();
});

/* ════════════════════════════════════════
   MUSIC LINK
════════════════════════════════════════ */
function goMusic() {
  window.open("https://too.fm/pussypoppin", "_blank");
}

/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObs.unobserve(e.target); // fire once
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

/* ════════════════════════════════════════
   PARALLAX — pillar videos drift as you scroll
════════════════════════════════════════ */
const videoWraps = document.querySelectorAll(".pillar-video-wrap");

window.addEventListener("scroll", () => {
  const y = window.scrollY;

  // Parallax: each video moves at a slightly different rate for layered depth
  videoWraps.forEach((wrap, i) => {
    const speed = 0.10 + i * 0.025;
    wrap.style.transform = `translateY(${y * speed}px)`;
  });
}, { passive: true });
