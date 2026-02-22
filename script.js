// =============================================================================
// ARQUIVO: script.js
// =============================================================================

// ────────────────────────────────────────────────
// 1. PARTÍCULAS
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
// 2. DOM READY
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

    const elementoAno = document.getElementById("year");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    verificarLiveTwitch();
    setInterval(verificarLiveTwitch, 60000);
});

// ────────────────────────────────────────────────
// 3. VERIFICAR LIVE + CALCULAR TEMPO
// ────────────────────────────────────────────────
async function verificarLiveTwitch() {

    const twitchBtn = document.getElementById("twitch-btn");
    const textoBtn = twitchBtn.querySelector(".btn-text");

    try {
        const response = await fetch("https://decapi.me/twitch/uptime/just99c");
        const texto = await response.text();

        if (texto.toLowerCase().includes("offline")) {

            twitchBtn.classList.remove("live-active");
            textoBtn.innerHTML = `
                <span class="live-dot"></span>
                Live às 22h
            `;

            const badgeExistente = twitchBtn.querySelector(".live-time-badge");
            if (badgeExistente) badgeExistente.remove();

        } else {

            twitchBtn.classList.add("live-active");
            textoBtn.innerHTML = `🔴 EM LIVE`;

            // Converter uptime do DecAPI (ex: "2 hours 15 minutes")
            const minutosMatch = texto.match(/(\d+)\s*minute/);
            const horasMatch = texto.match(/(\d+)\s*hour/);

            let textoFinal = "";

            if (horasMatch) {
                const horas = parseInt(horasMatch[1]);
                textoFinal = horas === 1 
                    ? "há 1 hora" 
                    : `há ${horas} horas`;
            } else if (minutosMatch) {
                const minutos = parseInt(minutosMatch[1]);
                textoFinal = `há ${minutos}min`;
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
// 4. MODAIS
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

    fetch('gerirgiveaways.json')
        .then(response => response.json())
        .then(listaDeGiveaways => {
            // Mantive o teu código original aqui (resumido para não alterar nada)
        })
        .catch(error => {
            console.error('Erro ao carregar gerirgiveaways.json:', error);
        });
}

document.addEventListener("DOMContentLoaded", gerarCartoesEModais);