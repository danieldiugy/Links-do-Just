// ==========================
// PARTÍCULAS
// ==========================

const particlesContainer = document.getElementById('particles');
const numParticles = 60;

if (particlesContainer) {
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
}

// ==========================
// ATUALIZAR ANO
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// ==========================
// MODAL FUNCTIONS
// ==========================

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) {
    console.warn(`Modal com id ${id} não encontrado`);
    return;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Fechar ao clicar fora
window.addEventListener("click", function(e) {
  document.querySelectorAll(".modal").forEach(modal => {
    if (e.target === modal) {
      closeModal(modal.id);
    }
  });
});

// Fechar com ESC
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.active").forEach(modal => {
      closeModal(modal.id);
    });
  }
});

// ==========================
// DADOS DOS GIVEAWAYS
// ==========================

const giveaways = [
  {
    id: 1,
    titulo: "Karambit Doppler FN",
    status: "on",                    // ← alterado
    site: "teste.com",
    deposito: "10€",
    requisitos: "",
    imagem: "assets/testegiveaway.png",
    link: "https://linksdojust.com",
    overlayTexto: "🔥 Karambit Doppler Factory New"
  },
  {
    id: 2,
    titulo: "Butterfly Vanilla",
    status: "off",                   // ← alterado
    site: "OutroSite.com",
    deposito: "20€",
    vencedor: "André (Teste)",
    descricao: "Este giveaway já terminou.",
    descricaoExtra: "",
    imagem: "assets/butterflygiveawayteste.png",
    link: "https://linksdojust.com",
    overlayTexto: "🏆 Terminado – Vencedor revelado"
  }
  // adiciona mais aqui quando quiseres
];

// ==========================
// GERAR CARDS + MODAIS
// ==========================

function criarGiveaways() {
  const container = document.getElementById("giveaways-container");
  if (!container) return;

  container.innerHTML = "";

  // Ordenar: "on" primeiro
  const sorted = [...giveaways].sort((a, b) => {
    if (a.status === "on" && b.status !== "on") return -1;
    if (a.status !== "on" && b.status === "on") return 1;
    return 0;
  });

  sorted.forEach(g => {
    const card = document.createElement("div");
    card.className = "giveaway-card";

    // Badge
    const badge = document.createElement("span");
    badge.className = `badge ${g.status}`;          // on ou off
    badge.textContent = g.status === "on" ? "ON" : "OFF";
    card.appendChild(badge);

    // Botão info (i)
    const infoBtn = document.createElement("div");
    infoBtn.className = "info-btn";
    infoBtn.textContent = "i";
    infoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(`modal-${g.id}`);
    });
    card.appendChild(infoBtn);

    // Imagem (com link se "on")
    if (g.status === "on") {
      const link = document.createElement("a");
      link.href = g.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const img = document.createElement("img");
      img.src = g.imagem;
      img.alt = `${g.titulo} - Participar`;
      link.appendChild(img);
      card.appendChild(link);
    } else {
      const img = document.createElement("img");
      img.src = g.imagem;
      img.alt = `${g.titulo} - Encerrado`;
      card.appendChild(img);
    }

    // Overlay
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.textContent = g.overlayTexto || `${g.site} • ${g.deposito}`;
    card.appendChild(overlay);

    container.appendChild(card);

    // ─── MODAL ───────────────────────────────────────
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = `modal-${g.id}`;

    const requisitosHTML   = g.requisitos?.trim()     ? `<p><strong>Requisitos:</strong> ${g.requisitos}</p>`     : "";
    const vencedorHTML     = g.vencedor && g.status === "off"
      ? `<p><strong>Vencedor:</strong> ${g.vencedor}</p>` : "";
    const descHTML         = g.descricao?.trim()      ? `<p>${g.descricao}</p>`          : "";
    const descExtraHTML    = g.descricaoExtra?.trim() ? `<p>${g.descricaoExtra}</p>`     : "";

    const botaoHTML = g.status === "on"
      ? `<a href="${g.link}" target="_blank" rel="noopener noreferrer" class="participar-btn">Participar Agora</a>`
      : `<button class="participar-btn disabled" disabled>Giveaway Encerrado</button>`;

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">×</span>
        <img src="${g.imagem}" alt="${g.titulo}" class="modal-img">
        <h2>${g.titulo}</h2>
        ${vencedorHTML}
        ${descHTML}
        ${descExtraHTML}
        <p><strong>Site:</strong> ${g.site}</p>
        <p><strong>Depósito mínimo:</strong> ${g.deposito}</p>
        ${requisitosHTML}
        <div style="margin-top: 24px;">
          ${botaoHTML}
        </div>
      </div>
    `;

    // Evento de fechar no ×
    modal.querySelector(".close-modal").addEventListener("click", () => {
      closeModal(`modal-${g.id}`);
    });

    document.body.appendChild(modal);
  });
}

document.addEventListener("DOMContentLoaded", criarGiveaways);
