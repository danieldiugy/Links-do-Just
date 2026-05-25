// =============================================================================
// PARTÍCULAS
// =============================================================================

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

// =============================================================================
// DOM READY
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {

    const elementoAno = document.getElementById("year");

    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    gerarCartoesEModais();

    verificarLiveTwitch();

    setInterval(verificarLiveTwitch, 60000);
});

// =============================================================================
// TWITCH LIVE
// =============================================================================

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
                Twitch
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

                textoFinal = horas === 1
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
        }

    } catch (erro) {

        console.error("Erro Twitch:", erro);
    }
}

// =============================================================================
// GIVEAWAYS
// =============================================================================

function gerarCartoesEModais() {

    const container = document.getElementById("giveaways-container");

    if (!container) return;

    container.innerHTML = `
        <p style="text-align:center; color:#aaa; padding:40px 0;">
            A carregar patrocínios...
        </p>
    `;

    fetch('gerirgiveawaysteste.json')

        .then(response => {

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return response.json();
        })

        .then(listaDeGiveaways => {

            container.innerHTML = "";

            const visiveis = listaDeGiveaways.filter(g =>
                g.status === "on" || g.status === "off1"
            );

            if (visiveis.length === 0) {

                container.innerHTML = `
                    <p style="text-align:center; color:#aaa; padding:60px 20px;">
                        Não há sponsors neste momento.
                    </p>
                `;

                return;
            }

            const ordenados = [...visiveis].sort((a, b) => {

                if (a.status === "on" && b.status !== "on") return -1;

                if (a.status !== "on" && b.status === "on") return 1;

                return 0;
            });

            ordenados.forEach(giveaway => {

                // CARD

                const cartao = document.createElement("div");

                cartao.className = `
                    giveaway-card
                    ${giveaway.status === "off1" ? "terminated" : ""}
                `;

                cartao.style.cursor = "pointer";

                // BADGE

                const badge = document.createElement("span");

                badge.className = `badge ${giveaway.status}`;

                badge.textContent =
                    giveaway.status === "on"
                        ? "ATIVO"
                        : "TERMINADO";

                cartao.appendChild(badge);

                // INFO BUTTON

                const botaoInfo = document.createElement("div");

                botaoInfo.className = "info-btn";

                botaoInfo.textContent = "i";

                botaoInfo.addEventListener("click", (evento) => {

                    evento.stopPropagation();

                    abrirModal(`modal-${giveaway.id}`);
                });

                cartao.appendChild(botaoInfo);

                // IMAGEM

                if (giveaway.status === "on") {

                    const link = document.createElement("a");

                    link.href = giveaway.link;

                    link.target = "_blank";

                    link.rel = "noopener noreferrer";

                    link.addEventListener("click", e => e.stopPropagation());

                    const img = document.createElement("img");

                    img.src = giveaway.imagem;

                    img.alt = giveaway.titulo;

                    link.appendChild(img);

                    cartao.appendChild(link);

                } else {

                    const img = document.createElement("img");

                    img.src = giveaway.imagem;

                    img.alt = giveaway.titulo;

                    img.style.filter = "grayscale(70%) contrast(80%)";

                    cartao.appendChild(img);
                }

                // OVERLAY

                const overlay = document.createElement("div");

                overlay.className = "overlay";

                overlay.textContent =
                    giveaway.overlayTexto ||
                    `${giveaway.site} • ${giveaway.deposito}`;

                cartao.appendChild(overlay);

                // BOTTOM LABEL

                if (giveaway.textoinferior?.trim()) {

                    const bottomLabel = document.createElement("div");

                    bottomLabel.className = "bottom-label";

                    bottomLabel.textContent = giveaway.textoinferior;

                    cartao.appendChild(bottomLabel);
                }

                // CLICK CARD

                cartao.addEventListener("click", () => {
                    abrirModal(`modal-${giveaway.id}`);
                });

                container.appendChild(cartao);

                // MODAL

                const modal = document.createElement("div");

                modal.className = "modal";

                modal.id = `modal-${giveaway.id}`;

                modal.innerHTML = `
                    <div class="modal-content">

                        <span class="close-modal">×</span>

                        <img
                            src="${giveaway.imagem}"
                            class="modal-img"
                            alt="${giveaway.titulo}"
                        >

                        <h2>${giveaway.titulo}</h2>

                        <p><strong>Site:</strong> ${giveaway.site}</p>

                        <p><strong>Depósito:</strong> ${giveaway.deposito}</p>

                        ${
                            giveaway.codigo
                                ? `<p><strong>Código:</strong> ${giveaway.codigo}</p>`
                                : ""
                        }

                        ${
                            giveaway.requisitos
                                ? `<p><strong>Requisitos:</strong> ${giveaway.requisitos}</p>`
                                : ""
                        }

                        ${
                            giveaway.vencedor
                                ? `<p><strong>Vencedor:</strong> ${giveaway.vencedor}</p>`
                                : ""
                        }

                        ${
                            giveaway.status === "on"
                                ? `
                                <div style="margin-top:24px;">
                           <a
    href="${giveaway.link}"
    target="_blank"
    rel="noopener noreferrer"
    class="participar-btn"
>
    Apostar em CS
</a>
                                </div>
                                `
                                : ""
                        }

                    </div>
                `;

                modal.querySelector(".close-modal")
                    .addEventListener("click", () => {
                        fecharModal(`modal-${giveaway.id}`);
                    });

                document.body.appendChild(modal);
            });
        })

        .catch(error => {

            console.error(error);

            container.innerHTML = `
                <p style="text-align:center; color:#ff4444; padding:60px 20px;">
                    Erro ao carregar os patrocínios.
                </p>
            `;
        });
}

// =============================================================================
// MODAIS
// =============================================================================

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

// FECHAR AO CLICAR FORA

window.addEventListener("click", e => {

    if (e.target.classList.contains("modal")) {

        fecharModal(e.target.id);
    }
});

// FECHAR ESC

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        document.querySelectorAll(".modal.active").forEach(m => {

            fecharModal(m.id);
        });
    }
});