// AUDIO
const music = document.getElementById("bg-music");
const hover = document.getElementById("hover-sound");

// volume levels
if (music) music.volume = 0.2;
if (hover) hover.volume = 0.12;

// start music on first interaction
document.body.addEventListener("click", () => {
  if (music) music.play().catch(()=>{});
}, { once: true });

// ENTER SITE
function enterSite() {
  window.location.href = "/home.html";
}

// HOVER SOUND
function playHover() {
  if (!hover) return;
  hover.currentTime = 0;
  hover.play().catch(()=>{});
}

// SHOP SCROLL
function scrollToShop() {
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

// ARCHIVE ALERT
function archiveAlert() {
  const popup = document.getElementById("popup");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

// MUSIC LINK
function goMusic() {
  window.location.href = "https://too.fm/pussypoppin";
}

// PRODUCT DENY
function deny(el) {
  el.classList.add("clicked");

  setTimeout(() => {
    el.classList.remove("clicked");
  }, 500);
}

// PARALLAX
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const container = document.querySelector(".container");
  if (container) {
    container.style.transform = `translateY(${scrollY * -0.05}px)`;
  }
});