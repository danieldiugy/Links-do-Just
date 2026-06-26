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


    gerarCartoesEModais();


    verificarLiveTwitch();


    setInterval(verificarLiveTwitch, 60000);


});






// ────────────────────────────────────────────────
// 3. TWITCH LIVE
// ────────────────────────────────────────────────


async function verificarLiveTwitch() {


    const twitchBtn = document.getElementById("twitch-btn");


    if (!twitchBtn) return;


    const textoBtn = twitchBtn.querySelector(".btn-text");



    try {


        const response = await fetch(
            "https://decapi.me/twitch/uptime/just99c"
        );


        const texto = await response.text();



        if (
            texto.toLowerCase().includes("offline") ||
            texto.trim() === ""
        ) {


            twitchBtn.classList.remove("live-active");


            textoBtn.innerHTML = `
                <span class="live-dot"></span>
                Twitch
            `;


            const badge =
            twitchBtn.querySelector(".live-time-badge");


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



            const horasMatch =
            texto.match(/(\d+)\s*hour/);


            const minutosMatch =
            texto.match(/(\d+)\s*minute/);



            if (horasMatch) {


                const horas =
                parseInt(horasMatch[1]);


                textoFinal =
                horas === 1
                ? "há 1 hora"
                : `há ${horas} horas`;



            } else if (minutosMatch) {


                const minutos =
                parseInt(minutosMatch[1]);


                textoFinal =
                `há ${minutos} min`;

            }



            let badge =
            twitchBtn.querySelector(".live-time-badge");



            if (!badge) {


                badge =
                document.createElement("span");


                badge.classList.add(
                    "live-time-badge"
                );


                twitchBtn.appendChild(badge);

            }



            badge.textContent = textoFinal;

        }



    } catch (erro) {


        console.error(
            "Erro ao verificar live:",
            erro
        );

    }

}






// ────────────────────────────────────────────────
// 4. CARDS DOS PATROCÍNIOS
// ────────────────────────────────────────────────


function gerarCartoesEModais() {


    const container =
    document.getElementById(
        "ofertas-container"
    );



    if (!container) return;



    container.innerHTML = `

        <p style="
        text-align:center;
        color:#aaa;
        padding:40px 0;">
        A carregar patrocínios...
        </p>

    `;





    fetch("gerirpatrocinios.json")

    .then(response => {


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        return response.json();


    })



    .then(listaDeGiveaways => {


        container.innerHTML = "";



        const visiveis =
        listaDeGiveaways.filter(g =>

            g.status === "on" ||
            g.status === "off1"

        );



        if (visiveis.length === 0) {


            container.innerHTML = `

            <p style="
            text-align:center;
            color:#aaa;
            padding:60px 20px;">

            Não há sponsors neste momento.

            </p>

            `;


            return;

        }



        const ordenados =
        [...visiveis].sort((a,b)=>{


            if (
                a.status === "on" &&
                b.status !== "on"
            )
            return -1;



            if (
                a.status !== "on" &&
                b.status === "on"
            )
            return 1;



            return 0;


        });




        ordenados.forEach(giveaway => {


            // CARD

            const cartao =
            document.createElement("a");



            cartao.className =
            `ofertas-card ${
            giveaway.status !== "on"
            ? "terminated"
            : ""
            }`;

const botao = document.createElement("div");

botao.className = "ofertas-btn";

botao.textContent = "AGARRAR BÓNUS";

            if (giveaway.status === "on") {


                cartao.href =
                giveaway.link;


                cartao.target =
                "_blank";


                cartao.rel =
                "noopener noreferrer";


            }



            const img =
            document.createElement("img");


            img.src =
            giveaway.imagem;


            img.alt =
            giveaway.titulo;



            cartao.appendChild(img);




            const content =
            document.createElement("div");


            content.className =
            "ofertas-content";



            const title =
            document.createElement("div");


            title.className =
            "ofertas-title";


            title.textContent =
            giveaway.titulo;



const sub = document.createElement("div");
sub.className = "ofertas-sub";

const siteTag = document.createElement("span");
siteTag.className = "site-tag";
siteTag.textContent = giveaway.site;

sub.appendChild(siteTag);


if (giveaway["18"] === true) {

    const tag18 = document.createElement("span");

    tag18.className = "tag-18";

    tag18.textContent = "18+";

    sub.appendChild(tag18);

}



            content.appendChild(title);

            content.appendChild(sub);


            cartao.appendChild(content);



const infoBtn = document.createElement("div");

infoBtn.className = "info-btn";

infoBtn.textContent = "i";



        if (giveaway.status === "on") {

    const actions = document.createElement("div");

    actions.className = "ofertas-actions";

    actions.appendChild(infoBtn);
    actions.appendChild(botao);

    cartao.appendChild(actions);

}
/* 👇 AQUI É ONDE ENTRA O PASSO 3 */
infoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const modal = document.getElementById(`modal-${giveaway.id}`);
    if (!modal) return;

    const content = modal.querySelector(".modal-content");

    content.innerHTML = `
        <span class="close-modal">×</span>

        <img src="${giveaway.imagem}" class="modal-img">

        <h2>${giveaway.titulo}</h2>

        <p><strong>Site:</strong> ${giveaway.site}</p>

        ${giveaway.modalinfo ? `
            <p class="modal-info">${giveaway.modalinfo}</p>
        ` : ""}
    `;

    modal.classList.add("active");
});
/* botão i */
cartao.appendChild(infoBtn);
cartao.appendChild(botao);




            container.appendChild(cartao);
            // ==========================
            // MODAL
            // ==========================

            const modal = document.createElement("div");

            modal.className = "modal";

            modal.id = `modal-${giveaway.id}`;

const oldModal = document.getElementById(`modal-${giveaway.id}`);
if (oldModal) oldModal.remove();

let conteudoModal = `
    <span class="close-modal">×</span>

    <div class="modal-header">
        <h2>${giveaway.titulo}</h2>
        <div class="modal-site">${giveaway.site}</div>
    </div>

    <img src="${giveaway.imagem}" class="modal-img" alt="${giveaway.titulo}">
`;


if (giveaway.modalinfo && giveaway.modalinfo.trim() !== "") {
    conteudoModal += `
        <p class="modal-info">
            ${giveaway.modalinfo}
        </p>
    `;
}
if (giveaway.status === "on") {
    conteudoModal += `
        <a href="${giveaway.link}" target="_blank" class="modal-btn">
            AGARRAR BÓNUS
        </a>
    `;
}


            if (giveaway.codigo && giveaway.codigo.trim() !== "") {


                conteudoModal += `

                    <p>
                        <strong>Código:</strong>
                        ${giveaway.codigo}
                    </p>

                `;

            }




            if (giveaway.requisitos && giveaway.requisitos.trim() !== "") {


                conteudoModal += `

                    <p>
                        <strong>Requisitos:</strong>
                        ${giveaway.requisitos}
                    </p>

                `;

            }






            modal.innerHTML = `

                <div class="modal-content">

                    ${conteudoModal}

                </div>

            `;




            modal
            .querySelector(".close-modal")
            .addEventListener("click", () => {

                fecharModal(
                    `modal-${giveaway.id}`
                );

            });




            document.body.appendChild(modal);





            // Se estiver encerrado abre modal ao clicar

            if (giveaway.status !== "on") {


                cartao.href = "#";


                cartao.addEventListener(
                    "click",
                    (evento) => {


                        evento.preventDefault();


                        abrirModal(
                            `modal-${giveaway.id}`
                        );


                    }
                );


            }



        });



    })



    .catch(error => {


        console.error(
            "Erro ao carregar giveaways:",
            error
        );



        container.innerHTML = `

            <p style="
            text-align:center;
            color:#ff4444;
            padding:60px 20px;">

            Erro ao carregar os giveaways:
            ${error.message}

            </p>

        `;


    });


}







// ────────────────────────────────────────────────
// 5. FUNÇÕES DE MODAL
// ────────────────────────────────────────────────


function abrirModal(idDoModal) {


    const modal =
    document.getElementById(idDoModal);



    if (!modal) return;



    modal.classList.add("active");

    document.body.style.overflow =
    "hidden";


}





function fecharModal(idDoModal) {


    const modal =
    document.getElementById(idDoModal);



    if (!modal) return;



    modal.classList.remove("active");


    document.body.style.overflow =
    "auto";


}






window.addEventListener("click", e => {


    if (
        e.target.classList.contains("modal")
    ) {


        fecharModal(
            e.target.id
        );

    }


});






document.addEventListener("keydown", e => {


    if (e.key === "Escape") {


        document
        .querySelectorAll(".modal.active")
        .forEach(m => {


            fecharModal(m.id);


        });


    }


});