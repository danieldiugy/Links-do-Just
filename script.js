// =============================================================================
// ARQUIVO: script.js
// Objetivo: Controlar partículas, ano no footer, modais e gerar giveaways
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

    // Carrega giveaways
    gerarCartoesEModais();

    // Verifica live na Twitch
    verificarLiveTwitch();
    setInterval(verificarLiveTwitch, 60000);
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
// 4. GERA CARTÕES E MODAIS DE GIVEAWAYS
// ────────────────────────────────────────────────
function gerarCartoesEModais() {
    const container = document.getElementById("giveaways-container");
    if (!container) return;

    container.innerHTML = '<p style="text-align:center; color:#aaa; padding: 40px 0;">A carregar giveaways...</p>';

    fetch('gerirgiveaways.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(listaDeGiveaways => {
            container.innerHTML = ""; // Limpa o loading

            // Filtra apenas os ativos
            const ativos = listaDeGiveaways.filter(g => g.status === "on");

            if (ativos.length === 0) {
                // Nenhum giveaway ativo
                container.innerHTML = `
                    <p style="text-align:center; color:#aaa; padding: 60px 20px; font-size: 1.2rem;">
                        Não há giveaways neste momento
                    </p>
                `;
                return;
            }

            // Ordena só os ativos (não precisa ordenar terminados se não mostramos)
            const ordenados = [...ativos].sort((a, b) => {
                // Se quiseres ordenar por outro critério, adiciona aqui
                return 0;
            });

            ordenados.forEach(giveaway => {
                // CARTÃO
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

                const vencedorHTML = giveaway.vencedor && giveaway.status === "off"
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

                if (giveaway.status === "off") {
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

                modal.querySelector(".close-modal").addEventListener("click", () => abrirModal(`modal-${giveaway.id}`));

                document.body.appendChild(modal);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar giveaways:', error);
            container.innerHTML = `<p style="text-align:center; color:#ff4444; padding:60px 20px; font-size:1.2rem;">
                Erro ao carregar os giveaways: ${error.message}<br>
                Verifica se "gerirgiveaways.json" existe e é válido.
            </p>`;
        });
}