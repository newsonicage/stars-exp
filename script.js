const music = document.getElementById("bg-music");

// Unlock audio on first interaction
document.body.addEventListener("click", () => {
  music.play().catch(() => {});
}, { once: true });

function enterSite() {
  const password = document.getElementById("password").value;

  if (password === "stars") {
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = "/home.html"; // future page
    }, 1000);
  } else {
    alert("ACCESS DENIED");
  }
}