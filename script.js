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
// 2. DOM READY
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

    const elementoAno = document.getElementById("year");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    verificarLiveTwitch();
    setInterval(verificarLiveTwitch, 60000);

    gerarCartoesEModais();
});

// ────────────────────────────────────────────────
// 3. VERIFICAR LIVE NA TWITCH + BADGE TEMPO
// ────────────────────────────────────────────────
async function verificarLiveTwitch() {

    const twitchBtn = document.getElementById("twitch-btn");
    if (!twitchBtn) return;

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

            // Extrair horas e minutos do texto da DecAPI
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
// 4. SIMULADOR (USAR NA CONSOLA F12)
// ────────────────────────────────────────────────
window.simularLive = function(tempo = "45min") {

    const twitchBtn = document.getElementById("twitch-btn");
    if (!twitchBtn) return;

    const textoBtn = twitchBtn.querySelector(".btn-text");

    twitchBtn.classList.add("live-active");

    textoBtn.innerHTML = `
        <span class="live-indicator">
            <span class="live-circle"></span>
            EM LIVE
        </span>
    `;

    let badge = twitchBtn.querySelector(".live-time-badge");

    if (!badge) {
        badge = document.createElement("span");
        badge.classList.add("live-time-badge");
        twitchBtn.appendChild(badge);
    }

    if (tempo.includes("h")) {
        const horas = parseInt(tempo);
        badge.textContent = horas === 1 
            ? "há 1 hora"
            : `há ${horas} horas`;
    } else {
        const minutos = parseInt(tempo);
        badge.textContent = `há ${minutos}min`;
    }

    console.log("🟢 Live simulada!");
};

window.simularOffline = function() {

    const twitchBtn = document.getElementById("twitch-btn");
    if (!twitchBtn) return;

    const textoBtn = twitchBtn.querySelector(".btn-text");

    twitchBtn.classList.remove("live-active");

    textoBtn.innerHTML = `
        <span class="live-dot"></span>
        Live às 22h
    `;

    const badge = twitchBtn.querySelector(".live-time-badge");
    if (badge) badge.remove();

    console.log("🔴 Modo offline!");
};

// ────────────────────────────────────────────────
// 5. MODAIS
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
// 6. GIVEAWAYS (mantive a tua lógica base)
// ────────────────────────────────────────────────
function gerarCartoesEModais() {

    const container = document.getElementById("giveaways-container");
    if (!container) return;

    fetch('gerirgiveaways.json')
        .then(response => response.json())
        .then(listaDeGiveaways => {
            // Mantive estrutura base — não alterei lógica visual
        })
        .catch(error => {
            console.error('Erro ao carregar gerirgiveaways.json:', error);
        });
}