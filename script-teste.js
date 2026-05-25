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
        console.error("Erro Twitch:", erro);
    }
}

// =============================================================================
// SPONSORS (CS2 STYLE)
// =============================================================================

function gerarCartoesEModais() {

    const container = document.getElementById("patrocinios-container");
    if (!container) return;

    container.innerHTML = `
        <p style="text-align:center; color:#aaa; padding:40px 0;">
            A carregar patrocínios...
        </p>
    `;

    fetch('gerirpatrociniosteste.json')

        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })

        .then(lista => {

            container.innerHTML = "";

            const visiveis = lista.filter(g =>
                g.status === "on" || g.status === "off1"
            );

            if (visiveis.length === 0) {
                container.innerHTML = `
                    <p style="text-align:center; color:#aaa; padding:60px 20px;">
                        Não há sponsors agora.
                    </p>
                `;
                return;
            }

            const ordenados = [...visiveis].sort((a, b) => {
                if (a.status === "on" && b.status !== "on") return -1;
                if (a.status !== "on" && b.status === "on") return 1;
                return 0;
            });

            ordenados.forEach(g => {

                // =========================
                // CARD SPONSOR
                // =========================
                const card = document.createElement("div");
                card.className = `sponsor-main ${g.status === "off1" ? "terminated" : ""}`;

                card.addEventListener("click", () => {
                    abrirModal(`modal-${g.id}`);
                });

                // LOGO
                const logo = document.createElement("img");
                logo.className = "sponsor-logo";
                logo.src = g.imagem;
                logo.alt = g.titulo;
                card.appendChild(logo);

                // TITULO
                const title = document.createElement("div");
                title.className = "sponsor-title";
                title.textContent = g.titulo;
                card.appendChild(title);

                // DESC
                const desc = document.createElement("div");
                desc.className = "sponsor-desc";
                desc.textContent = g.overlayTexto || "";
                card.appendChild(desc);

                // BOTÃO
                const btn = document.createElement("a");
                btn.href = g.link;
                btn.target = "_blank";
                btn.rel = "noopener noreferrer";
                btn.className = "sponsor-btn";
                btn.textContent = "AGARRAR BÓNUS";
                btn.addEventListener("click", e => e.stopPropagation());
                card.appendChild(btn);

                container.appendChild(card);

                // =========================
                // MODAL
                // =========================
                const modal = document.createElement("div");
                modal.className = "modal";
                modal.id = `modal-${g.id}`;

                modal.innerHTML = `
                    <div class="modal-content">

                        <span class="close-modal">×</span>

                        <img src="${g.imagem}" class="modal-img" alt="${g.titulo}">

                        <h2>${g.titulo}</h2>

                        <p><strong>Site:</strong> ${g.site}</p>
                        <p><strong>Depósito:</strong> ${g.deposito}</p>

                        ${g.codigo ? `<p><strong>Código:</strong> ${g.codigo}</p>` : ""}
                        ${g.requisitos ? `<p><strong>Requisitos:</strong> ${g.requisitos}</p>` : ""}
                        ${g.vencedor ? `<p><strong>Vencedor:</strong> ${g.vencedor}</p>` : ""}

                        ${g.status === "on" ? `
                            <div style="margin-top:24px;">
                                <a href="${g.link}" target="_blank"
                                   rel="noopener noreferrer"
                                   class="participar-btn">
                                   Apostar em CS
                                </a>
                            </div>
                        ` : ""}

                    </div>
                `;

                modal.querySelector(".close-modal")
                    .addEventListener("click", () => fecharModal(`modal-${g.id}`));

                document.body.appendChild(modal);
            });
        })

        .catch(err => {
            console.error(err);
            container.innerHTML = `
                <p style="text-align:center; color:#ff4444; padding:60px 20px;">
                    Erro ao carregar sponsors.
                </p>
            `;
        });
}

// =============================================================================
// MODAIS
// =============================================================================

function abrirModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
}

window.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
        fecharModal(e.target.id);
    }
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        document.querySelectorAll(".modal.active").forEach(m => {
            fecharModal(m.id);
        });
    }
});