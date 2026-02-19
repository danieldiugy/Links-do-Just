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
        badgeText = `há ${minutes}min`;
      } else if (uptime.includes("hour")) {
        const hours = uptime.match(/\d+/)?.[0];
        badgeText = `há ${hours} hora${hours > 1 ? "s" : ""}`;
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

function openModal(event, id) {
  event.preventDefault();
  event.stopPropagation();

  const modal = document.getElementById(id);
  modal.style.display = "flex";

  // bloquear scroll
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = "none";

  // restaurar scroll
  document.body.style.overflow = "auto";
}

// fechar ao clicar fora
window.addEventListener("click", function(e) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});

// fechar com ESC
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
      if (modal.style.display === "flex") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }
});

/* ========================= */
/* SISTEMA AUTOMÁTICO GIVEAWAYS */
/* ========================= */

const giveaways = [
  {
    id: 1,
    status: "ativo",
    site: "teste.com",
    deposito: "10€",
    requisitos: "Seguir o canal e estar presente na live.",
    imagem: "assets/testegiveaway.png",
    link: "https://linksdojust.com"
  },
  {
    id: 2,
    status: "acabado",
    site: "OutroSite.com",
    deposito: "20€",
    vencedor: "André (Teste)",
    imagem: "assets/testegiveaway.png",
    link: "https://linksdojust.com"
  }
];

function criarGiveaways() {
  const container = document.getElementById("giveaways-container");
  if (!container) return;

  giveaways.forEach(g => {

    // Criar card
    const card = document.createElement("div");
    card.className = "giveaway-card";

    // Badge
    const badge = document.createElement("span");
    badge.className = `badge ${g.status}`;
    badge.textContent = g.status === "ativo" ? "ATIVO" : "ACABADO";
    card.appendChild(badge);

    // Botão info
    const infoBtn = document.createElement("div");
    infoBtn.className = "info-btn";
    infoBtn.textContent = "i";
    infoBtn.onclick = (e) => openModal(e, `modal-${g.id}`);
    card.appendChild(infoBtn);

    // Imagem
    if (g.status === "ativo") {
      const link = document.createElement("a");
      link.href = g.link;
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = g.imagem;
      link.appendChild(img);
      card.appendChild(link);
    } else {
      const img = document.createElement("img");
      img.src = g.imagem;
      card.appendChild(img);
    }

    // Overlay
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.textContent = `Site: ${g.site} | Depósito: ${g.deposito}`;
    card.appendChild(overlay);

    container.appendChild(card);

    // Criar modal
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = `modal-${g.id}`;

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal" onclick="closeModal('modal-${g.id}')">&times;</span>
        <h2>${g.status === "ativo" ? "Informações do Giveaway" : "Giveaway Acabado"}</h2>
        <p><strong>Site:</strong> ${g.site}</p>
        <p><strong>Depósito mínimo:</strong> ${g.deposito}</p>
        ${
          g.status === "ativo"
            ? `<p><strong>Requisitos:</strong> ${g.requisitos}</p>
               <a href="${g.link}" target="_blank" class="participar-btn">Participar</a>`
            : `<p><strong>Vencedor:</strong> ${g.vencedor}</p>
               <p>Este giveaway já acabou.</p>
               <button class="participar-btn disabled" disabled>Participar</button>`
        }
      </div>
    `;

    document.body.appendChild(modal);
  });
}

document.addEventListener("DOMContentLoaded", criarGiveaways);

