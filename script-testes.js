// PARTICULAS
const particulasContainer = document.getElementById("particles");

if (particulasContainer) {

  const quantidadeParticulas = 60;

  for (let i = 0; i < quantidadeParticulas; i++) {

    const particula = document.createElement("div");

    particula.classList.add("particle");

    const tamanho = Math.random() * 5 + 1.5;

    particula.style.width = `${tamanho}px`;
    particula.style.height = `${tamanho}px`;

    particula.style.left = `${Math.random() * 100}vw`;

    const duracao = Math.random() * 30 + 25;
    const atraso = Math.random() * 25;

    particula.style.animationDuration = `${duracao}s`;
    particula.style.animationDelay = `-${atraso}s`;

    particulasContainer.appendChild(particula);
  }
}

// DOM READY
document.addEventListener("DOMContentLoaded", () => {

  // ANO FOOTER
  const ano = document.getElementById("year");

  if (ano) {
    ano.textContent = new Date().getFullYear();
  }

  // LIVE TWITCH
  verificarLiveTwitch();

  setInterval(verificarLiveTwitch, 60000);
});

// VERIFICAR LIVE
async function verificarLiveTwitch() {

  const twitchBtn = document.getElementById("twitch-btn");

  if (!twitchBtn) return;

  const textoBtn = twitchBtn.querySelector(".btn-text");

  try {

    const response = await fetch(
      "https://decapi.me/twitch/uptime/just99c"
    );

    const texto = await response.text();

    // OFFLINE
    if (
      texto.toLowerCase().includes("offline") ||
      texto.trim() === ""
    ) {

      twitchBtn.classList.remove("live-active");

      textoBtn.innerHTML = `
        <span class="live-dot"></span>
        Twitch
      `;

      const badge = twitchBtn.querySelector(".live-time-badge");

      if (badge) badge.remove();

      return;
    }

    // ONLINE
    twitchBtn.classList.add("live-active");

    textoBtn.innerHTML = `
      <span class="live-indicator">
        <span class="live-circle"></span>
        EM LIVE
      </span>
    `;

    let textoFinal = "";

    const horasMatch = texto.match(/(\d+)\s*hour/);
    const minutosMatch = texto.match(/(\d+)\s*minute/);

    if (horasMatch) {

      const horas = parseInt(horasMatch[1]);

      textoFinal =
        horas === 1
          ? "há 1 hora"
          : `há ${horas} horas`;

    } else if (minutosMatch) {

      const minutos = parseInt(minutosMatch[1]);

      textoFinal = `há ${minutos} min`;
    }

    let badge = twitchBtn.querySelector(".live-time-badge");

    if (!badge) {

      badge = document.createElement("span");

      badge.classList.add("live-time-badge");

      twitchBtn.appendChild(badge);
    }

    badge.textContent = textoFinal;

  } catch (erro) {

    console.error("Erro Twitch:", erro);
  }
}