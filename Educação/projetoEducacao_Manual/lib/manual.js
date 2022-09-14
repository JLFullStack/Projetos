const titulo = document.querySelector("#content-title-header");

function gerenciarTopicosDoMenuLateral(el) {
    fecharConteudo();

    let topicoLateral = el.dataset.side_topico;
    const
        containers = document.querySelectorAll("[data-content_box]"),
        topicos = document.querySelectorAll("[data-side_topico]");

    titulo.innerText = el.innerText;

    topicos.forEach(x => {
        x.classList.remove("side-destaque");
    });
    el.classList.add("side-destaque");

    for (let i = 0; i < containers.length; i++) {
        let conteudo = containers[i].dataset.content_box;

        if (topicoLateral === conteudo) containers[i].style.display = "block";
        else containers[i].style.display = "none";
    }
}

function gerenciarTopicosDosConteudos(el) {
    let topico_conteudo = el.dataset.content_topico;
    const
        containers = document.querySelectorAll("[data-content_item]"),
        topicosConteudo = document.querySelectorAll("[data-content_topico]");

    topicosConteudo.forEach(x => {
        x.classList.remove("content-destaque-active");
    });
    el.classList.add("content-destaque-active");

    for (let i = 0; i < containers.length; i++) {
        let item_conteudo = containers[i].dataset.content_item;

        if (topico_conteudo === item_conteudo) {

            //verifica se conteúdo está aberto
            if (containers[i].classList.contains("content-open")) {
                containers[i].classList.remove("content-open");
                containers[i].classList.add("content-closed");
                el.classList.remove("content-destaque-active");
                el.classList.add("content-destaque-inactive");
            } else {
                containers[i].classList.remove("content-closed");
                containers[i].classList.add("content-open")
                el.classList.remove("content-destaque-inactive");
            }
        } else {
            containers[i].classList.remove("content-open");
            containers[i].classList.add("content-closed");
        }
    }
}

function gerenciarResponsividadeDoMenuLateral() {
    const
        menu = document.querySelectorAll(".side-bar"),
        conteudo = document.querySelectorAll(".content"),
        closed_button = document.querySelectorAll(".glyphicon-remove"),
        open_button = document.querySelectorAll(".glyphicon-menu-hamburger");

    for (let i = 0; i < menu.length; i++) {

        //verifica se menu lateral está aberto
        if (menu[i].classList.contains("side-bar-active")) {
            menu[i].classList.remove("side-bar-active");
            open_button[i].classList.remove("glyphicon-menu-hamburger-inactive");
            conteudo[i].classList.remove("content-inactive");

            menu[i].classList.add("side-bar-inactive");
            open_button[i].classList.add("glyphicon-menu-hamburger-active");
            conteudo[i].classList.add("content-active");
        } else {
            menu[i].classList.remove("side-bar-inactive");
            open_button[i].classList.remove("glyphicon-menu-hamburger-active");
            conteudo[i].classList.remove("content-active");

            menu[i].classList.add("side-bar-active");
            open_button[i].classList.add("glyphicon-menu-hamburger-inactive");
            conteudo[i].classList.add("content-inactive");
        }
    }
}

function fecharConteudo() {
    const
        topico_conteudo = document.querySelectorAll(".content-topico"),
        item_conteudo = document.querySelectorAll(".content-item");

    for (let i = 0; i < topico_conteudo.length; i++) {
        if (topico_conteudo[i].classList.contains("content-destaque-active")) {
            topico_conteudo[i].classList.remove("content-destaque-active");
        }

        if (item_conteudo[i].classList.contains("content-open")) {
            item_conteudo[i].classList.remove("content-open");
        }
    }
}

function ativarDownloadDoConteudo() {
    let
        txt_download = document.querySelector("#txt-download-manual-pdf");
        link = document.querySelector("#btn-download-manual-pdf");
    const
        topico = document.querySelectorAll("[data-side_topico]");

    //verifica qual tópico está aberto e ativa o download do manual do mesmo
    for (let i = 0; i < topico.length; i++) {
        if (topico[i].classList.contains("side-destaque")) {
            if (topico[i].innerText === "Professor") {
                txt_download.innerHTML = "Download manual do Professor" + "&nbsp;";
                link.href = "lib/documentos/Notas e Faltas - Manual de Utilização do Professor.pdf"

            } else if (topico[i].innerText === "Gestor") {
                txt_download.innerHTML = "Download manual do Gestor" + "&nbsp;";
                link.href = "lib/documentos/Notas e Faltas - Manual de Utilização do Gestor.pdf"

            } else if (topico[i].innerText === "Ocorrências") {
                txt_download.innerHTML = "Download manual das Ocorrências" + "&nbsp;";
                link.href = "lib/documentos/Notas e Faltas - Manual de Utilização das Ocorrências.pdf"
            }
        }
    }
}