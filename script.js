// =============================================================================
// ARQUIVO: script.js
// =============================================================================

// Variável para evitar execução múltipla
let jaCarregado = false;

// ────────────────────────────────────────────────
// 1. PARTÍCULAS NO FUNDO
// ────────────────────────────────────────────────
const particulasContainer = document.getElementById('particles');
const quantidadeParticulas = 60;
if (particulasContainer) {
    for (let i = 0; i < quantidadeParticulas; i++) {
        const particula = document.createElement('div');
        particula.classList.add('particle');
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

// ────────────────────────────────────────────────
// 2. ATUALIZAR ANO NO FOOTER
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const elementoAno = document.getElementById("year");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }
});

// ────────────────────────────────────────────────
// 3. FUNÇÕES DOS MODAIS
// ────────────────────────────────────────────────
function abrirModal(idDoModal) {
    const modal = document.getElementById(idDoModal);
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function fecharModal(idDoModal) {
    const modal = document.getElementById(idDoModal);
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
}

window.addEventListener("click", function(evento) {
    document.querySelectorAll(".modal").forEach(modal => {
        if (evento.target === modal) fecharModal(modal.id);
    });
});

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        document.querySelectorAll(".modal.active").forEach(modal => fecharModal(modal.id));
    }
});

// ────────────────────────────────────────────────
// 4. FUNÇÃO PRINCIPAL (com proteção anti-duplicação)
// ────────────────────────────────────────────────
function gerarCartoesEModais() {
    if (jaCarregado) return; // Evita executar 2x
    jaCarregado = true;

    const container = document.getElementById("giveaways-container");
    if (!container) return;

    // Limpa tudo antes (cards + modais antigos)
    container.innerHTML = "";
    document.querySelectorAll('.modal').forEach(m => m.remove());

    fetch('gerirgiveaways.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}. Verifica "gerirgiveaways.json".`);
            }
            return response.json();
        })
        .then(listaDeGiveaways => {
            const ordenados = [...listaDeGiveaways].sort((a, b) => {
                if (a.status === "on" && b.status !== "on") return -1;
                if (a.status !== "on" && b.status === "on") return 1;
                return 0;
            });

            ordenados.forEach(giveaway => {
                // CARTÃO
                const cartao = document.createElement("div");
                cartao.className = "giveaway-card";
                cartao.style.cursor = "pointer";
                cartao.addEventListener("click", (e) => {
                    if (!e.target.closest(".info-btn") && !e.target.closest("a") && !e.target.closest("img")) {
                        abrirModal(`modal-${giveaway.id}`);
                    }
                });

                const badge = document.createElement("span");
                badge.className = `badge ${giveaway.status}`;
                badge.textContent = giveaway.status === "on" ? "Ativo" : "Acabado";
                cartao.appendChild(badge);

                const botaoInfo = document.createElement("div");
                botaoInfo.className = "info-btn";
                botaoInfo.textContent = "i";
                botaoInfo.addEventListener("click", (e) => {
                    e.stopPropagation();
                    abrirModal(`modal-${giveaway.id}`);
                });
                cartao.appendChild(botaoInfo);

                if (giveaway.status === "on") {
                    const link = document.createElement("a");
                    link.href = giveaway.link;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.addEventListener("click", e => e.stopPropagation());
                    const img = document.createElement("img");
                    img.src = giveaway.imagem;
                    img.alt = `${giveaway.titulo} - Participar`;
                    link.appendChild(img);
                    cartao.appendChild(link);
                } else {
                    const img = document.createElement("img");
                    img.src = giveaway.imagem;
                    img.alt = `${giveaway.titulo} - Encerrado`;
                    cartao.appendChild(img);
                }

                const overlay = document.createElement("div");
                overlay.className = "overlay";
                overlay.textContent = giveaway.overlayTexto || `${giveaway.site} • ${giveaway.deposito}`;
                cartao.appendChild(overlay);

                container.appendChild(cartao);

                // MODAL
                const modal = document.createElement("div");
                modal.className = "modal";
                modal.id = `modal-${giveaway.id}`;

                const vencedorHTML = giveaway.vencedor && giveaway.status === "off" ? `<p><strong>Vencedor:</strong> ${giveaway.vencedor}</p>` : "";
                const codigoHTML = giveaway.codigo?.trim() ? `<p><strong>Código:</strong> ${giveaway.codigo}</p>` : "";
                const siteHTML = `<p><strong>Site:</strong> ${giveaway.site}</p>`;
                const depositoHTML = `<p><strong>Depósito mínimo:</strong> ${giveaway.deposito}</p>`;
                const requisitosHTML = giveaway.requisitos?.trim() ? `<p><strong>Requisitos:</strong> ${giveaway.requisitos}</p>` : "";
                const espacamento = `<p style="margin: 16px 0;"></p>`;

                let conteudo = "";
                if (giveaway.status === "off") {
                    conteudo = `
                        <span class="close-modal">×</span>
                        <img src="${giveaway.imagem}" alt="${giveaway.titulo}" class="modal-img">
                        <h2>${giveaway.titulo}</h2>
                        ${vencedorHTML}
                        ${espacamento}
                        ${siteHTML}
                        ${codigoHTML}
                        ${depositoHTML}
                        ${requisitosHTML}
                    `;
                } else {
                    conteudo = `
                        <span class="close-modal">×</span>
                        <img src="${giveaway.imagem}" alt="${giveaway.titulo}" class="modal-img">
                        <h2>${giveaway.titulo}</h2>
                        ${siteHTML}
                        ${espacamento}
                        ${codigoHTML}
                        ${depositoHTML}
                        ${requisitosHTML}
                        <div style="margin-top: 24px;">
                            <a href="${giveaway.link}" target="_blank" rel="noopener noreferrer" class="participar-btn">Participar</a>
                        </div>
                    `;
                }

                modal.innerHTML = `<div class="modal-content">${conteudo}</div>`;

                modal.querySelector(".close-modal").addEventListener("click", () => fecharModal(`modal-${giveaway.id}`));

                document.body.appendChild(modal);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar:', error);
            container.innerHTML = `<p style="text-align:center; color:#ff4444; padding:30px;">
                Erro ao carregar gerirgiveaways.json: ${error.message}<br><br>
                Verifica se o ficheiro existe na raiz e tem JSON válido.
            </p>`;
        });
}

document.addEventListener("DOMContentLoaded", gerarCartoesEModais);