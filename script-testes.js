// =============================================================================
// ARQUIVO: script-testes.js
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
// 2. DOM READY + ANO + SEGUIDORES + LIVE
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const elementoAno = document.getElementById("year");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    atualizarSeguidores();
    verificarLiveTwitch();
    setInterval(verificarLiveTwitch, 60000);
});

// ────────────────────────────────────────────────
// 3. ATUALIZAR SEGUIDORES (SVG + número com ponto + "+")
// ────────────────────────────────────────────────
function atualizarSeguidores() {
    // Twitch
    const twitchFollowers = 29700; // 29.7K → "29.700+"
    adicionarSeguidores('twitch-followers', twitchFollowers);

    // Instagram
    const instagramFollowers = 184525; // 184.525 → "184.525+"
    adicionarSeguidores('instagram-followers', instagramFollowers);

    // TikTok @just99c
    const tiktok1Followers = 181900; // 181.9K → "181.900+"
    adicionarSeguidores('tiktok1-followers', tiktok1Followers);

    // TikTok @maisdojust
    const tiktok2Followers = 883; // 883 → "883+"
    adicionarSeguidores('tiktok2-followers', tiktok2Followers);

    // TikTok @livesdojust
    const tiktok3Followers = 500; // 500 → "500+"
    adicionarSeguidores('tiktok3-followers', tiktok3Followers);

    // YouTube @just99500
    const youtubeFollowers = 150000; // 150.000 → "150.000+"
    adicionarSeguidores('youtube-followers', youtubeFollowers);
}

// Formata número com ponto como separador + "+" (sem arredondar para baixo, mostra exato)
function formatNumber(num) {
    return num.toLocaleString('pt-PT') + '+';
}

// Adiciona o bloco SVG + número (SVG com cor da borda dos botões: #d4af37)
function adicionarSeguidores(id, count) {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    const formatted = formatNumber(count);

    elemento.innerHTML = `
        <svg class="followers-svg" viewBox="0 0 24 24" fill="#d4af37">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <span>${formatted}</span>
    `;
}

// ────────────────────────────────────────────────
// 4. DETECÇÃO DE LIVE NA TWITCH COM DECAPI
// ────────────────────────────────────────────────
function verificarLiveTwitch() {
  fetch('https://decapi.me/twitch/uptime/just99c')
    .then(response => response.text())
    .then(status => {
      console.log('Resposta DecAPI (uptime):', status.trim());
      const liveText = document.querySelector('#twitch-btn .btn-text');
      const liveDot = document.querySelector('#twitch-btn .live-dot');
      const statusLower = status.trim().toLowerCase();

      if (statusLower.includes('offline') || statusLower === '') {
        liveText.innerHTML = '<span class="live-dot"></span> Live às 22h';
        liveDot.classList.remove('pulse');
      } else {
        liveText.innerHTML = '<span class="live-dot"></span> EM LIVE';
        liveDot.classList.add('pulse');
      }
    })
    .catch(error => {
      console.error('Erro ao verificar live com DecAPI:', error);
      const liveText = document.querySelector('#twitch-btn .btn-text');
      const liveDot = document.querySelector('#twitch-btn .live-dot');
      liveText.innerHTML = '<span class="live-dot"></span> Live às 22h';
      liveDot.classList.remove('pulse');
    });
}

// ────────────────────────────────────────────────
// 5. GERA CARTÕES E MODAIS DE GIVEAWAYS (mantido)
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

                const paragrafoEspacamento = `<p style="margin: 16px 0;"></p>`;

                let conteudoModal = "";

                if (giveaway.status === "off") {
                    conteudoModal = `
                        <span class="close-modal">×</span>
                        <img src="${giveaway.imagem}" alt="${giveaway.titulo}" class="modal-img">
                        <h2>${giveaway.titulo}</h2>
                        ${vencedorHTML}
                        ${paragrafoEspacamento}
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
                        ${paragrafoEspacamento}
                        ${codigoHTML}
                        ${depositoHTML}
                        ${requisitosHTML}
                        <div style="margin-top: 24px;">
                            <a href="${giveaway.link}" target="_blank" rel="noopener noreferrer" class="participar-btn">Participar</a>
                        </div>
                    `;
                }

                modal.innerHTML = `
                    <div class="modal-content">
                        ${conteudoModal}
                    </div>
                `;

                modal.querySelector(".close-modal").addEventListener("click", () => {
                    fecharModal(`modal-${giveaway.id}`);
                });

                document.body.appendChild(modal);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar gerirgiveaways.json:', error);
            container.innerHTML = '<p style="text-align:center; color:#ff4444;">Erro ao carregar os giveaways. Tenta recarregar a página.</p>';
        });
}

// Inicia tudo quando a página carrega
document.addEventListener("DOMContentLoaded", gerarCartoesEModais);