// =============================================================================
// ARQUIVO: script.js
// =============================================================================

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
// 2. DOM READY + LIVE CHECK + GIVEAWAYS
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const elementoAno = document.getElementById("year");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    gerarCartoesEModais();
    verificarLiveTwitch();
    setInterval(verificarLiveTwitch, 60000);
});

// ────────────────────────────────────────────────
// 3. VERIFICAR LIVE NA TWITCH + BADGE TEMPO (mantido)
// ────────────────────────────────────────────────
async function verificarLiveTwitch() {
    const twitchBtn = document.getElementById("twitch-btn");
    if (!twitchBtn) return;

    const textoBtn = twitchBtn.querySelector(".btn-text");

    try {
        const response = await fetch("https://decapi.me/twitch/uptime/just99c");
        const texto = await response.text();

        if (texto.toLowerCase().includes("offline") || texto.trim() === "") {
            twitchBtn.classList.remove("live-active");
            textoBtn.innerHTML = `
                <span class="live-dot"></span>
                Live às 22h
            `;
            const badge = twitchBtn.querySelector(".live-time-badge");
            if (badge) badge.remove();
        } else {
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
                textoFinal = horas === 1 ? "há 1 hora" : `há ${horas} horas`;
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
        }
    } catch (erro) {
        console.error("Erro ao verificar live:", erro);
    }
}

// ────────────────────────────────────────────────
// 4. GERA CARTÕES E MODAIS DE GIVEAWAYS (com 3 status)
// ────────────────────────────────────────────────
function gerarCartoesEModais() {
    const container = document.getElementById("giveaways-container");
    if (!container) return;

    container.innerHTML = '<p style="text-align:center; color:#aaa; padding:40px 0;">A carregar giveaways...</p>';

    fetch('gerirgiveaways.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(listaDeGiveaways => {
            container.innerHTML = "";

            // Filtra apenas os que devem aparecer: on ou off1
            const visiveis = listaDeGiveaways.filter(g => 
                g.status === "on" || g.status === "off1"
            );

            if (visiveis.length === 0) {
                container.innerHTML = `
                    <p style="text-align:center; color:#aaa; padding:60px 20px; font-size:1.2rem;">
                        Não há giveaways neste momento
                    </p>
                `;
                return;
            }

            // Ordena: ativos primeiro
            const ordenados = [...visiveis].sort((a, b) => {
                if (a.status === "on" && b.status !== "on") return -1;
                if (a.status !== "on" && b.status === "on") return 1;
                return 0;
            });

            ordenados.forEach(giveaway => {
                // ─── CARTÃO ───
                const cartao = document.createElement("div");
                cartao.className = `giveaway-card ${giveaway.status === "off1" ? "terminated" : ""}`;
                cartao.style.cursor = "pointer";
                cartao.addEventListener("click", (evento) => {
                    if (!evento.target.closest(".info-btn") && !evento.target.closest("a") && !evento.target.closest("img")) {
                        abrirModal(`modal-${giveaway.id}`);
                    }
                });

                const badge = document.createElement("span");
                badge.className = `badge ${giveaway.status}`;
                badge.textContent = giveaway.status === "on" ? "ATIVO" : "TERMINADO";
                cartao.appendChild(badge);

                const botaoInfo = document.createElement("div");
                botaoInfo.className = "info-btn";
                botaoInfo.textContent = "i";
                botaoInfo.addEventListener("click", (evento) => {
                    evento.stopPropagation();
                    abrirModal(`modal-${giveaway.id}`);
                });
                cartao.appendChild(botaoInfo);

                if (giveaway.status === "on") {
                    const link = document.createElement("a");
                    link.href = giveaway.link;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.addEventListener("click", (evento) => evento.stopPropagation());
                    const img = document.createElement("img");
                    img.src = giveaway.imagem;
                    img.alt = `${giveaway.titulo} - Participar`;
                    link.appendChild(img);
                    cartao.appendChild(link);
                } else {
                    const img = document.createElement("img");
                    img.src = giveaway.imagem;
                    img.alt = `${giveaway.titulo} - Encerrado`;
                    img.style.filter = "grayscale(70%) contrast(80%)"; // Visual "terminado"
                    cartao.appendChild(img);
                }

                const overlay = document.createElement("div");
                overlay.className = "overlay";
                overlay.textContent = giveaway.overlayTexto || `${giveaway.site} • ${giveaway.deposito}`;
                cartao.appendChild(overlay);
                // ─── TEXTO INFERIOR ESQUERDO ───
if (giveaway.textoinferior?.trim()) {
    const bottomLabel = document.createElement("div");
    bottomLabel.className = "bottom-label";
    bottomLabel.textContent = giveaway.textoinferior;
    cartao.appendChild(bottomLabel);
}

                container.appendChild(cartao);

                // ─── MODAL ───
                const modal = document.createElement("div");
                modal.className = "modal";
                modal.id = `modal-${giveaway.id}`;

                const vencedorHTML = giveaway.vencedor
                    ? `<p><strong>Vencedor:</strong> ${giveaway.vencedor}</p>` : "";

                const codigoHTML = giveaway.codigo?.trim()
                    ? `<p><strong>Código:</strong> ${giveaway.codigo}</p>` : "";

                const siteHTML = `<p><strong>Site:</strong> ${giveaway.site}</p>`;

                const depositoHTML = `<p><strong>Depósito mínimo:</strong> ${giveaway.deposito}</p>`;

                const requisitosHTML = giveaway.requisitos?.trim()
                    ? `<p><strong>Requisitos:</strong> ${giveaway.requisitos}</p>` : "";

                const umEspacamento = `<p style="margin: 16px 0;"></p>`;
                const doisEspacamentos = umEspacamento + umEspacamento;

                let conteudoModal = "";

                if (giveaway.status !== "on") {
                    conteudoModal = `
                        <span class="close-modal">×</span>
                        <img src="${giveaway.imagem}" alt="${giveaway.titulo}" class="modal-img">
                        <h2>${giveaway.titulo}</h2>
                        ${vencedorHTML}
                        ${umEspacamento}
                        ${siteHTML}
                        ${codigoHTML}
                        ${depositoHTML}
                        ${requisitosHTML}
                    `;
                } else {
                    conteudoModal = `
                        <span class="close-modal">×</span>
                        <img src="${giveaway.imagem}" alt="${giveaway.titulo}" class="modal-img">
                        <h2>${giveaway.titulo}</h2>
                        ${siteHTML}
                        ${doisEspacamentos}
                        ${codigoHTML}
                        ${depositoHTML}
                        ${requisitosHTML}
                        <div style="margin-top: 24px;">
                            <a href="${giveaway.link}" target="_blank" rel="noopener noreferrer" class="participar-btn">Participar</a>
                        </div>
                    `;
                }

                modal.innerHTML = `<div class="modal-content">${conteudoModal}</div>`;

                modal.querySelector(".close-modal").addEventListener("click", () => fecharModal(`modal-${giveaway.id}`));

                document.body.appendChild(modal);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar giveaways:', error);
            container.innerHTML = `<p style="text-align:center; color:#ff4444; padding:60px 20px;">
                Erro ao carregar os giveaways: ${error.message}
            </p>`;
        });
}

// ────────────────────────────────────────────────
// 5. FUNÇÕES DE MODAL
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

window.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) fecharModal(e.target.id);
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        document.querySelectorAll(".modal.active").forEach(m => fecharModal(m.id));
    }
});