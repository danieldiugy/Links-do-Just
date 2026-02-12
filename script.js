// Partículas
const particlesContainer = document.getElementById('particles');
const numParticles = 60;

for (let i = 0; i < numParticles; i++) {
  const particle = document.createElement('div');
  particle.classList.add('particle');

  const size = Math.random() * 5 + 1.5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * 100}vw`;

  const duration = Math.random() * 30 + 25;
  const delay = Math.random() * 25;
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `-${delay}s`;

  particlesContainer.appendChild(particle);
}

async function checkTwitchLive() {
  const twitchButton = document.getElementById('twitch-btn');
  const twitchText = twitchButton?.querySelector('.btn-text');
  const liveBadge = document.getElementById('live-badge');
  const liveDot = twitchButton?.querySelector('.live-dot');

  if (!twitchButton || !twitchText || !liveBadge || !liveDot) return;

  try {
    const statusRes = await fetch('https://decapi.me/twitch/status/just99c');
    const status = (await statusRes.text()).trim();

    if (status === 'LIVE') {

      const uptimeRes = await fetch('https://decapi.me/twitch/uptime/just99c');
      let uptime = (await uptimeRes.text()).trim();

      let badgeText = "";

      if (uptime.includes("minute")) {
        const minutes = uptime.match(/\d+/)?.[0];
        badgeText = `Há ${minutes}min`;
      } else if (uptime.includes("hour")) {
        const hours = uptime.match(/\d+/)?.[0];
        badgeText = `Há ${hours} hora${hours > 1 ? "s" : ""}`;
      }

twitchText.innerHTML =
  '<span class="live-dot"></span>EM LIVE';


      liveBadge.textContent = badgeText;

      liveDot.style.display = "inline-block";
      liveBadge.style.display = "inline-block";

      twitchButton.classList.add("live-pulse");

    } else {
      twitchText.innerHTML = "Live às 22h";
      liveBadge.style.display = "none";
      twitchButton.classList.remove("live-pulse");
    }

  } catch (error) {
    console.error('Erro Twitch:', error);
  }
}


document.addEventListener('DOMContentLoaded', checkTwitchLive);
setInterval(checkTwitchLive, 60000);

// Atualizar ano automaticamente
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
