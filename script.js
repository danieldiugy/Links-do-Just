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

// Twitch Live Check
async function checkTwitchLive() {
  const twitchButton = document.getElementById('twitch-btn');
  const twitchText = twitchButton?.querySelector('.btn-text');
  if (!twitchButton || !twitchText) return;

  try {
    const statusRes = await fetch('https://decapi.me/twitch/status/just99c');
    const status = (await statusRes.text()).trim();

    if (status === 'LIVE') {
      const uptimeRes = await fetch('https://decapi.me/twitch/uptime/just99c');
      let uptime = (await uptimeRes.text()).trim();

      uptime = uptime
        .replace('minutes', 'min')
        .replace('minute', 'min')
        .replace('hours', 'horas')
        .replace('hour', 'hora')
        .replace('and', 'e')
        .trim();

      twitchText.textContent = `há ${uptime}`;
      twitchButton.classList.add('live-pulse', 'live-text');
    } else {
      twitchText.textContent = 'Live às 22h';
      twitchButton.classList.remove('live-pulse', 'live-text');
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
