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
if (hoverSounds[0]) hoverSounds[0].volume = 0.15;
if (hoverSounds[1]) hoverSounds[1].volume = 0.15;
if (hoverSounds[2]) hoverSounds[2].volume = 0.55; // hover3 boosted

document.body.addEventListener("click", () => {
  if (music) music.play().catch(() => {});
}, { once: true });

/* ════════════════════════════════════════
   HOVER SOUND
════════════════════════════════════════ */
function playHover(n) {
  const s = hoverSounds[n - 1];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
}

/* ════════════════════════════════════════
   SHOP — scroll to sub-menu
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
  inner.classList.remove("animate");
  void inner.offsetWidth;
  inner.classList.add("animate");
  popup.classList.add("active");
}

function closeArchive() {
  document.getElementById("archive-popup").classList.remove("active");
}

/* ════════════════════════════════════════
   MUSIC LINK
════════════════════════════════════════ */
function goMusic() {
  window.open("https://too.fm/pussypoppin", "_blank");
}

/* ════════════════════════════════════════
   SETTINGS PANEL
════════════════════════════════════════ */
function openSettings() {
  document.getElementById("settings-overlay").classList.add("active");
  document.getElementById("settings-panel-wrap").classList.add("active");
}

function closeSettings() {
  document.getElementById("settings-overlay").classList.remove("active");
  document.getElementById("settings-panel-wrap").classList.remove("active");
}

document.getElementById("cog-btn").addEventListener("click", openSettings);
document.getElementById("settings-overlay").addEventListener("click", closeSettings);

/* ════════════════════════════════════════
   ERROR POPUP (Start a Co-Mission)
════════════════════════════════════════ */
function showSettingsError() {
  document.getElementById("error-popup").classList.add("active");
}

function closeErrorPopup() {
  document.getElementById("error-popup").classList.remove("active");
}

document.getElementById("error-popup").addEventListener("click", closeErrorPopup);

/* ════════════════════════════════════════
   CONTACT FORM POPUP (Request Communication)
════════════════════════════════════════ */
function openContactForm() {
  closeSettings();
  document.getElementById("contact-overlay").classList.add("active");
  document.getElementById("contact-panel-wrap").classList.add("active");
}

function closeContactForm() {
  document.getElementById("contact-overlay").classList.remove("active");
  document.getElementById("contact-panel-wrap").classList.remove("active");
  // reset form after close animation
  setTimeout(() => {
    const form = document.getElementById("contact-form");
    const success = document.getElementById("contact-success");
    if (form) { form.reset(); form.style.display = ""; }
    if (success) success.classList.remove("visible");
  }, 400);
}

document.getElementById("contact-overlay").addEventListener("click", closeContactForm);

/* ════════════════════════════════════════
   CART DRAWER
════════════════════════════════════════ */
function openCart() {
  document.getElementById("cart-drawer").classList.add("active");
  document.getElementById("cart-overlay").classList.add("active");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("active");
  document.getElementById("cart-overlay").classList.remove("active");
}

document.getElementById("cart-btn").addEventListener("click", openCart);
document.getElementById("cart-overlay").addEventListener("click", closeCart);
document.getElementById("cart-close-btn").addEventListener("click", closeCart);

/* ════════════════════════════════════════
   ESCAPE KEY
════════════════════════════════════════ */
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  closeArchive();
  closeSettings();
  closeErrorPopup();
  closeContactForm();
  closeCart();
});

/* ════════════════════════════════════════
   NETLIFY FORM SUBMISSION
════════════════════════════════════════ */
async function submitNetlifyForm(formEl) {
  try {
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(formEl)).toString(),
    });
  } catch (e) { /* proceeds to success state on live Netlify site */ }
}

/* contact form */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async e => {
    e.preventDefault();
    await submitNetlifyForm(e.target);
    e.target.style.display = "none";
    document.getElementById("contact-success").classList.add("visible");
    setTimeout(closeContactForm, 3200);
  });
}

/* footer newsletter */
const footerForm = document.getElementById("footer-form");
if (footerForm) {
  footerForm.addEventListener("submit", async e => {
    e.preventDefault();
    await submitNetlifyForm(e.target);
    e.target.style.display = "none";
    const s = document.getElementById("footer-success");
    if (s) s.style.display = "block";
  });
}

/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

/* ════════════════════════════════════════
   PARALLAX — pillar videos
════════════════════════════════════════ */
const videoWraps = document.querySelectorAll(".pillar-video-wrap");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  videoWraps.forEach((wrap, i) => {
    const speed = 0.10 + i * 0.025;
    wrap.style.transform = `translateY(${y * speed}px)`;
  });
}, { passive: true });

/* ════════════════════════════════════════
   FURNITURE VIDEO HOVER
════════════════════════════════════════ */
document.querySelectorAll(".furniture-product").forEach(card => {
  const video = card.querySelector(".product-hover-video");
  if (!video) return;
  card.addEventListener("mouseenter", () => video.play().catch(() => {}));
  card.addEventListener("mouseleave", () => { video.pause(); video.currentTime = 0; });
});
