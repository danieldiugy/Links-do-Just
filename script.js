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
// 2. ATUALIZAR ANO NO FOOTER
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const elementoAno = document.getElementById("year");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    verificarLiveTwitch();
    setInterval(verificarLiveTwitch, 60000); // verifica a cada 60s
});

// ────────────────────────────────────────────────
// 3. VERIFICAR LIVE NA TWITCH (DECAPI)
// ────────────────────────────────────────────────
async function verificarLiveTwitch() {
    const twitchBtn = document.getElementById("twitch-btn");
    const textoBtn = twitchBtn.querySelector(".btn-text");

    try {
        const response = await fetch("https://decapi.me/twitch/uptime/just99c");

        const texto = await response.text();

        // Quando está offline o DecAPI devolve:
        // "just99c is offline"
        if (texto.toLowerCase().includes("offline")) {

            twitchBtn.classList.remove("live-active");
            textoBtn.innerHTML = `
                <span class="live-dot"></span>
                Live às 22h
            `;

        } else {

            twitchBtn.classList.add("live-active");
            textoBtn.innerHTML = `
                🔴 EM LIVE
            `;

        }

    } catch (erro) {
        console.error("Erro ao verificar live:", erro);
    }
}

// ────────────────────────────────────────────────
// 4. FUNÇÕES DOS MODAIS
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
        if (evento.target === modal) {
            fecharModal(modal.id);
        }
    });
});

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        document.querySelectorAll(".modal.active").forEach(modal => {
            fecharModal(modal.id);
        });
    }
});

// ────────────────────────────────────────────────
// 5. GIVEAWAYS
// ────────────────────────────────────────────────
function gerarCartoesEModais() {
    const container = document.getElementById("giveaways-container");
    if (!container) return;
    container.innerHTML = "";

    fetch('gerirgiveaways.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Não foi possível carregar gerirgiveaways.json');
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

                const cartao = document.createElement("div");
                cartao.className = "giveaway-card";

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
                    link.addEventListener("click", (evento) => {
                        evento.stopPropagation();
                    });
                    const imagem = document.createElement("img");
                    imagem.src = giveaway.imagem;
                    imagem.alt = `${giveaway.titulo} - Participar`;
                    link.appendChild(imagem);
                    cartao.appendChild(link);
                } else {
                    const imagem = document.createElement("img");
                    imagem.src = giveaway.imagem;
                    imagem.alt = `${giveaway.titulo} - Encerrado`;
                    cartao.appendChild(imagem);
                }

                const overlay = document.createElement("div");
                overlay.className = "overlay";
                overlay.textContent = giveaway.overlayTexto || `${giveaway.site} • ${giveaway.deposito}`;
                cartao.appendChild(overlay);

                container.appendChild(cartao);
            });

        })
        .catch(error => {
            console.error('Erro ao carregar gerirgiveaways.json:', error);
        });
}

document.addEventListener("DOMContentLoaded", gerarCartoesEModais);