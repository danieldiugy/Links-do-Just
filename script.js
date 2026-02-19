// ==========================
// PARTÍCULAS
// ==========================

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

// ==========================
// ATUALIZAR ANO
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// ==========================
// MODAL
// ==========================

function openModal(event, id) {
  event.preventDefault();
  event.stopPropagation();
  const modal = document.getElementById(id);
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

window.addEventListener("click", function(e) {
  document.querySelectorAll(".modal").forEach(modal => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  }
});

// ==========================
// SISTEMA AUTOMÁTICO GIVEAWAYS
// ==========================

const giveaways = [
  {
    id: 1,
    status: "ativo",
    site: "teste.com",
    deposito: "10€",
    imagem: "assets/testegiveaway.png",
    link: "https://linksdojust.com"
  },
  {
    id: 2,
    status: "acabado",
    site: "teste.com",
    deposito: "20€",
    vencedor: "André (Teste)",
    imagem: "assets/butterflygiveawayteste.png",
    link: "https://linksdojust.com"
  }
];

function criarGiveaways() {
  const container = document.getElementById("giveaways-container");
  if (!container) return;

  giveaways.forEach(g => {

    const card = document.createElement("div");
    card.className = "giveaway-card";

    const badge = document.createElement("span");
    badge.className = `badge ${g.status}`;
    badge.textContent = g.status === "ativo" ? "ATIVO" : "ACABADO";
    card.appendChild(badge);

    const infoBtn = document.createElement("div");
    infoBtn.className = "info-btn";
    infoBtn.textContent = "i";
    infoBtn.onclick = (e) => openModal(e, `modal-${g.id}`);
    card.appendChild(infoBtn);

    const img = document.createElement("img");
    img.src = g.imagem;

    if (g.status === "ativo") {
      const link = document.createElement("a");
      link.href = g.link;
      link.target = "_blank";
      link.appendChild(img);
      card.appendChild(link);
    } else {
      card.appendChild(img);
    }

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
