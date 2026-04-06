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
   THEME MANAGEMENT
════════════════════════════════════════ */
function setTheme(theme) {
  document.body.classList.remove("theme-dark", "theme-light");
  document.body.classList.add("theme-" + theme);
}

/* Auto-switch theme based on scroll position */
(function initThemeScroll() {
  const shopEl  = document.getElementById("shop");
  const heroEl  = document.querySelector(".hero");
  if (!shopEl || !heroEl) return;

  function onScroll() {
    const shopTop = shopEl.getBoundingClientRect().top;
    const heroBottom = heroEl.getBoundingClientRect().bottom;
    // Enter light when shop section crests the middle of the viewport
    if (shopTop <= window.innerHeight * 0.55) {
      setTheme("light");
    } else if (heroBottom > window.innerHeight * 0.25) {
      setTheme("dark");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ════════════════════════════════════════
   SHOP — scroll to sub-menu (offset for fixed header)
════════════════════════════════════════ */
function scrollToShop() {
  setTheme("light");
  const el = document.getElementById("shop");
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 52;
  window.scrollTo({ top, behavior: "smooth" });
}

/* ════════════════════════════════════════
   EXIT SHOP — return to hero / dark mode
════════════════════════════════════════ */
function exitShop() {
  setTheme("dark");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ════════════════════════════════════════
   NOTIFY POPUP (Sold / Coming Soon)
════════════════════════════════════════ */
function openNotifyPopup(title) {
  document.getElementById("np-item-title").textContent = title;
  document.getElementById("np-item-field").value = title;
  document.getElementById("notify-overlay").classList.add("active");
  document.getElementById("notify-panel-wrap").classList.add("active");
}

function closeNotifyPopup() {
  document.getElementById("notify-overlay").classList.remove("active");
  document.getElementById("notify-panel-wrap").classList.remove("active");
  setTimeout(() => {
    const form = document.getElementById("notify-form");
    const success = document.getElementById("np-success");
    if (form) { form.reset(); form.style.display = ""; }
    if (success) success.classList.remove("visible");
  }, 400);
}

document.getElementById("notify-overlay").addEventListener("click", closeNotifyPopup);

const notifyForm = document.getElementById("notify-form");
if (notifyForm) {
  notifyForm.addEventListener("submit", async e => {
    e.preventDefault();
    await submitNetlifyForm(e.target);
    e.target.style.display = "none";
    document.getElementById("np-success").classList.add("visible");
    setTimeout(closeNotifyPopup, 3200);
  });
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
/* ════════════════════════════════════════
   LINKS POPUP
════════════════════════════════════════ */
function openLinkPanel() {
  document.getElementById("link-overlay").classList.add("active");
  document.getElementById("link-panel-wrap").classList.add("active");
}

function closeLinkPanel() {
  document.getElementById("link-overlay").classList.remove("active");
  document.getElementById("link-panel-wrap").classList.remove("active");
}

document.getElementById("link-btn").addEventListener("click", openLinkPanel);
document.getElementById("link-overlay").addEventListener("click", closeLinkPanel);

/* ════════════════════════════════════════
   COPY TOAST
════════════════════════════════════════ */
let toastTimer = null;
function showCopyToast(msg) {
  const toast = document.getElementById("copy-toast");
  toast.textContent = msg || "Copied!";
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2000);
}

function copySiteLink() {
  navigator.clipboard.writeText("https://starsinfern0.com").then(() => {
    showCopyToast("Link Copied!");
  });
}

function copyContactEmail() {
  navigator.clipboard.writeText("scratchbradley@gmail.com").then(() => {
    showCopyToast("Email Copied!");
  });
}

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  closeArchive();
  closeSettings();
  closeErrorPopup();
  closeContactForm();
  closeCart();
  closeNotifyPopup();
  closeLinkPanel();
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
