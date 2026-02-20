// =============================================================================
// ARQUIVO: script.js
// Objetivo: Controlar partículas no fundo, atualizar o ano no footer,
//           abrir/fechar modais e gerar os cartões + modais dos giveaways
// =============================================================================


// ────────────────────────────────────────────────
// 1. PARTÍCULAS NO FUNDO (efeito visual bonito)
// ────────────────────────────────────────────────
const particulasContainer = document.getElementById('particles');
const quantidadeParticulas = 60;

if (particulasContainer) {
    // Criamos 60 partículas aleatórias que flutuam
    for (let i = 0; i < quantidadeParticulas; i++) {
        const particula = document.createElement('div');
        particula.classList.add('particle');

        // Tamanho aleatório pequeno (entre ~1.5px e 6.5px)
        const tamanho = Math.random() * 5 + 1.5;
        particula.style.width = `${tamanho}px`;
        particula.style.height = `${tamanho}px`;

        // Posição aleatória na largura da tela
        particula.style.left = `${Math.random() * 100}vw`;

        // Duração e atraso aleatórios para parecer natural
        const duracao = Math.random() * 30 + 25;      // entre 25s e 55s
        const atraso = Math.random() * 25;
        particula.style.animationDuration = `${duracao}s`;
        particula.style.animationDelay = `-${atraso}s`;

        particulasContainer.appendChild(particula);
    }
}


// ────────────────────────────────────────────────
// 2. ATUALIZAR O ANO NO FOOTER AUTOMATICAMENTE
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const elementoAno = document.getElementById("year");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }
});


// ────────────────────────────────────────────────
// 3. FUNÇÕES PARA CONTROLAR OS MODAIS
// ────────────────────────────────────────────────

// Abre um modal específico
function abrirModal(idDoModal) {
    const modal = document.getElementById(idDoModal);
    if (!modal) {
        console.warn(`Não encontrei modal com id: ${idDoModal}`);
        return;
    }

    modal.classList.add("active");
    // Impede scroll da página enquanto modal está aberto
    document.body.style.overflow = "hidden";
}

// Fecha um modal específico
function fecharModal(idDoModal) {
    const modal = document.getElementById(idDoModal);
    if (!modal) return;

    modal.classList.remove("active");
    // Devolve o scroll normal à página
    document.body.style.overflow = "auto";
}

// Fecha o modal se clicar fora da caixa (no fundo escuro)
window.addEventListener("click", function(evento) {
    document.querySelectorAll(".modal").forEach(modal => {
        // Se clicou exatamente no fundo (não no conteúdo)
        if (evento.target === modal) {
            fecharModal(modal.id);
        }
    });
});

// Fecha qualquer modal aberto ao pressionar a tecla ESC
document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        document.querySelectorAll(".modal.active").forEach(modal => {
            fecharModal(modal.id);
        });
    }
});


// ────────────────────────────────────────────────
// 4. DADOS DOS GIVEAWAYS (aqui é onde colocas todos os sorteios)
// ────────────────────────────────────────────────
const listaDeGiveaways = [
    {
        id: 1,
        titulo: "Karambit Doppler FN",
        status: "on",               // "on" = ativo   /   "off" = terminado
        site: "teste.com",
        deposito: "10€",
        codigo: "50JUST",
        requisitos: "",
        imagem: "assets/testegiveaway.png",
        link: "https://linksdojust.com",
        overlayTexto: "🔥 Karambit Doppler Factory New"
    },
    {
        id: 2,
        titulo: "Butterfly Vanilla",
        status: "off",
        site: "OutroSite.com",
        deposito: "20€",
        codigo: "50JUST",
        vencedor: "André (Teste)",
        descricao: "Este giveaway já terminou.",
        descricaoExtra: "",
        imagem: "assets/butterflygiveawayteste.png",
        link: "https://linksdojust.com",
        overlayTexto: "🏆 Terminado – Vencedor revelado"
    }
    // Podes adicionar mais objetos aqui no futuro
];


// ────────────────────────────────────────────────
// 5. FUNÇÃO PRINCIPAL: CRIA OS CARTÕES E OS MODAIS
// ────────────────────────────────────────────────
function gerarCartoesEModais() {
    const container = document.getElementById("giveaways-container");
    if (!container) return;

    // Limpa tudo que já estiver dentro do container
    container.innerHTML = "";

    // Ordena a lista: giveaways ativos ("on") aparecem primeiro
    const ordenados = [...listaDeGiveaways].sort((a, b) => {
        if (a.status === "on" && b.status !== "on") return -1;
        if (a.status !== "on" && b.status === "on") return 1;
        return 0;
    });

    // Para cada giveaway, criamos um cartão + um modal
    ordenados.forEach(giveaway => {
        // ─── CRIAR O CARTÃO NA PÁGINA PRINCIPAL ───
        const cartao = document.createElement("div");
        cartao.className = "giveaway-card";

        // Badge (Ativo ou Acabado)
        const badge = document.createElement("span");
        badge.className = `badge ${giveaway.status}`;
        badge.textContent = giveaway.status === "on" ? "Ativo" : "Acabado";
        cartao.appendChild(badge);

        // Botão "i" de informação (abre o modal)
        const botaoInfo = document.createElement("div");
        botaoInfo.className = "info-btn";
        botaoInfo.textContent = "i";
        botaoInfo.addEventListener("click", (evento) => {
            evento.stopPropagation();           // Evita propagar o clique
            abrirModal(`modal-${giveaway.id}`);
        });
        cartao.appendChild(botaoInfo);

        // Imagem (clicável apenas se estiver ativo)
        if (giveaway.status === "on") {
            const link = document.createElement("a");
            link.href = giveaway.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

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

        // Texto na parte de baixo do cartão
        const overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.textContent = giveaway.overlayTexto || `${giveaway.site} • ${giveaway.deposito}`;
        cartao.appendChild(overlay);

        container.appendChild(cartao);

        // ─── CRIAR O MODAL (janela que abre ao clicar no "i") ───
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.id = `modal-${giveaway.id}`;

        // Preparar cada parte do conteúdo do modal
        const requisitosHTML = giveaway.requisitos?.trim()
            ? `<p><strong>Requisitos:</strong> ${giveaway.requisitos}</p>`
            : "";

        const vencedorHTML = giveaway.vencedor && giveaway.status === "off"
            ? `<p><strong>Vencedor:</strong> ${giveaway.vencedor}</p>`
            : "";

        const descricaoHTML = giveaway.descricao?.trim()
            ? `<p>${giveaway.descricao}</p>`
            : "";

        const descricaoExtraHTML = giveaway.descricaoExtra?.trim()
            ? `<p>${giveaway.descricaoExtra}</p>`
            : "";

        const codigoHTML = giveaway.codigo?.trim()
            ? `<p><strong>Código:</strong> ${giveaway.codigo}</p>`
            : "";

        // Novo parágrafo inserido aqui, entre Site e Depósito mínimo
        const paragrafoExtraHTML = `<p style="margin: 16px 0; font-style: italic; opacity: 0.9;">
            Usa o código no depósito para entrares no sorteio!
        </p>`;

        const botaoParticiparHTML = giveaway.status === "on"
            ? `<a href="${giveaway.link}" target="_blank" rel="noopener noreferrer" class="participar-btn">Participar Agora</a>`
            : `<button class="participar-btn disabled" disabled>Giveaway Encerrado</button>`;

        // Colar tudo dentro do modal – nota a ordem: ... codigoHTML → paragrafoExtraHTML → site → deposito ...
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">×</span>
                <img src="${giveaway.imagem}" alt="${giveaway.titulo}" class="modal-img">
                <h2>${giveaway.titulo}</h2>
                ${vencedorHTML}
                ${descricaoHTML}
                ${descricaoExtraHTML}
                <p><strong>Site:</strong> ${giveaway.site}</p>
                ${paragrafoExtraHTML}
                <p><strong>Depósito mínimo:</strong> ${giveaway.deposito}</p>
                ${codigoHTML}
                ${requisitosHTML}
                <div style="margin-top: 24px;">
                    ${botaoParticiparHTML}
                </div>
            </div>
        `;

        // Evento para fechar clicando no "×"
        modal.querySelector(".close-modal").addEventListener("click", () => {
            fecharModal(`modal-${giveaway.id}`);
        });

        // Adiciona o modal ao body (fica escondido até ser aberto)
        document.body.appendChild(modal);
    });
}

// Executa a função quando a página carrega completamente
document.addEventListener("DOMContentLoaded", gerarCartoesEModais);
