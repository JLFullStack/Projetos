(() => {
    const _q = (elemento) => document.querySelector(elemento);
    const __q = (elementos) => document.querySelectorAll(elementos);
    const recarregar = () => window.location.reload();

    const chkLGPD = _q("#chk-lgpd");
    const btnVoltar = _q("#btn-voltar");
    const btnAvancar = _q("#btn-avancar");
    const btnCancelar = _q("#btn-dialog-cancelar");

    const inicio = 1, fim = 7;
    let posicao = 1;

    const aceitarTermos = (e) => {
        const lblLGPD = _q("#lbl-lgpd");
        const foiVerificado = e.target.checked;
        const cardFooter = _q(".card-footer");

        if (foiVerificado) {
            lblLGPD.innerHTML = "Concordo com todos os termos"
            cardFooter.style.display = "block";
            btnAvancar.style.display = "inline-block";
        }

        if (!foiVerificado) {
            lblLGPD.innerHTML = "Concorda com todos os termos acima?"
            cardFooter.style.display = "none";
            btnAvancar.style.display = "none";
        }
    }

    const exibirEtapa = (progress, barras, botoes, containers) => {
        const exibirProgress = () => __q(".card-header")[1].style.display = progress;

        const exibirBarras = () => {
            const redefinirProgress = (posicao, nomeDaClasse) => __q(".progress div")[posicao].className = nomeDaClasse;
            barras.forEach((nomeDaClasse, posicao) => redefinirProgress(posicao, nomeDaClasse));
        }

        const exibirBotoes = () => {
            btnVoltar.style.display = botoes[0];
            btnAvancar.style.display = botoes[1];
        }

        const exibirContainers = () => {
            const redefinirContainer = (container, visibilidade) => {
                for (let i = 0; i < container.length; i++) container[i].style.display = visibilidade;
            }

            containers.forEach((visibilidade, posicao) => redefinirContainer(__q(`.etapa-${posicao + 1}`), visibilidade));
        }

        const rolar = () => {
            document.body.scrollIntoView({
                block: "start",
                behavior: "smooth",
            });
        }

        exibirProgress();
        exibirBarras();
        exibirBotoes();
        exibirContainers();
        rolar();
    }

    const redefinirEtapa = () => {
        switch (posicao) {
            case 1:
                exibirEtapa(
                    "none",
                    ["", "", "", "", "", ""],
                    ["none", "inline-block"],
                    ["block", "none", "none", "none", "none", "none", "none"]
                );
                break;
            case 2:
                exibirEtapa(
                    "block",
                    ["progress-bar bg-success", "progress-bar bg-secondary", "progress-bar bg-secondary", "progress-bar bg-secondary", "progress-bar bg-secondary", "progress-bar bg-secondary"],
                    ["inline-block", "inline-block"],
                    ["none", "block", "none", "none", "none", "none", "none"]
                );
                break;
            case 3:
                exibirEtapa(
                    "block",
                    ["progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-secondary", "progress-bar bg-secondary", "progress-bar bg-secondary", "progress-bar bg-secondary"],
                    ["inline-block", "inline-block"],
                    ["none", "none", "block", "none", "none", "none", "none"]
                );
                break;
            case 4:
                exibirEtapa(
                    "block",
                    ["progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-secondary", "progress-bar bg-secondary", "progress-bar bg-secondary"],
                    ["inline-block", "inline-block"],
                    ["none", "none", "none", "block", "none", "none", "none"]
                );
                break;
            case 5:
                exibirEtapa(
                    "block",
                    ["progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-secondary", "progress-bar bg-secondary"],
                    ["inline-block", "inline-block"],
                    ["none", "none", "none", "none", "block", "none", "none"]
                );
                break;
            case 6:
                exibirEtapa(
                    "block",
                    ["progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-secondary"],
                    ["inline-block", "inline-block"],
                    ["none", "none", "none", "none", "none", "block", "none"]
                );
                break;
            case 7:
                exibirEtapa(
                    "block",
                    ["progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success", "progress-bar bg-success"],
                    ["inline-block", "none"],
                    ["none", "none", "none", "none", "none", "none", "block"]
                );
                break;
            default:
                break;
        }
    }

    const voltarEtapa = () => {
        if (posicao > inicio) {
            posicao--;

            redefinirEtapa();
        }
    }

    const avancarEtapa = () => {
        if (chkLGPD.checked === true) {
            if (posicao < fim) {
                posicao++;

                validarCampos();
                redefinirEtapa();
            }
        }
    }

    const gerenciarResponsividade = () => {
        const ajustar = (resolucao) => {
            if (resolucao.matches) {
                _q("#btn-voltar").classList.add("btn-sm");
                _q("#btn-avancar").classList.add("btn-sm");
                _q("#btn-finalizar").classList.add("btn-sm");
                _q("#btn-cancelar").classList.add("btn-sm");
                _q("#btn-dialog-fechar").classList.add("btn-sm");
                _q("#btn-dialog-cancelar").classList.add("btn-sm");
                //__q("legend svg").forEach(icone => { icone.classList.add("fa-sm"); });
            } else {
                _q("#btn-voltar").classList.remove("btn-sm");
                _q("#btn-avancar").classList.remove("btn-sm");
                _q("#btn-finalizar").classList.remove("btn-sm");
                _q("#btn-cancelar").classList.remove("btn-sm");
                _q("#btn-dialog-fechar").classList.remove("btn-sm");
                _q("#btn-dialog-cancelar").classList.remove("btn-sm");
                //__q("legend svg").forEach(icone => { icone.classList.remove("fa-sm"); });
            }
        }

        const resolucao_480px = window.matchMedia("(max-width: 480px)");

        ajustar(resolucao_480px);
        resolucao_480px.addListener(ajustar);
    }

    const mascararCampos = () => {
        const cpf = () => {
            __q(".input-cpf").forEach((campo) =>
                campo.addEventListener("input", function (e) {
                    const campo = e.target;
                    const valor = campo.value;

                    campo.value = valor
                        .replace(/\D+/g, "")
                        .replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
                        .replace(/(-\d{2})\d+?$/, "$1");
                })
            );
        }

        const moeda = () => {
            __q(".input-moeda").forEach((campo) =>
                campo.addEventListener("input", function (e) {
                    const campo = e.target;
                    const valor = campo.value;

                    campo.value = valor
                        .replace(/\D/g, "")
                        .replace(/(\d)(\d{2})$/, "$1,$2")
                        .replace(/(?=(\d{3})+(\D))\B/g, ".");
                })
            );
        }

        const numero = () => {
            __q(".input-numero").forEach((campo) =>
                campo.addEventListener("input", function (e) {
                    const campo = e.target;
                    const valor = campo.value;

                    if (valor === "-1") campo.value = "0";
                    else campo.value = valor.replace(/\D/g, "");
                })
            );
        }

        const tel = () => {
            __q(".input-tel").forEach((campo) =>
                campo.addEventListener("input", function (e) {
                    const campo = e.target;
                    const valor = campo.value;

                    campo.value = valor
                        .replace(/\D+/g, "")
                        .replace(/(\d{2})(\d)/, "($1) $2")
                        .replace(/(\d{4})(\d)/, "$1-$2")
                        .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
                        .replace(/(-\d{4})\d+?$/, "$1");
                })
            );
        }

        cpf();
        moeda();
        numero();
        tel();
    }

    const validarCampos = () => {
        let quantidadeDeErros = 0;

        const vazio = (campo, mensagem) => {
            inexistente(campo);
            modificado(campo);

            if (campo.value === "") {
                adicionar();
                campo.nextElementSibling.innerHTML = mensagem;
            } else campo.nextElementSibling.innerHTML = "";
        }

        const verificado = (campo, mensagem) => {
            inexistente(campo);
            modificado(campo);

            if (!campo.checked) {
                adicionar();
                campo.nextElementSibling.innerHTML = mensagem;
            } else campo.nextElementSibling.innerHTML = "";
        }

        const selecionado = (campo, mensagem) => {
            inexistente(campo);
            modificado(campo);

            if (campo.selectedIndex === 0) {
                adicionar();
                campo.nextElementSibling.innerHTML = mensagem;
            } else campo.nextElementSibling.innerHTML = "";
        }

        const adicionar = () => {
            quantidadeDeErros += 1;
        }

        const modificado = (campo) => {
            if (campo.nextElementSibling.tagName !== "SMALL" || campo.nextElementSibling.className !== "msg-error") {
                recarregar();
            }
        }

        const inexistente = (campo) => {
            if (campo.nextElementSibling === null) {
                const msgErro = document.createElement("small");
                msgErro.setAttribute("class", "msg-error");
                campo.after(msgErro);
            }
        }

        switch (posicao) {
            case 3:
                // TODO: Defina os campos obrigatórios como no exemplo
                vazio(_q("#titular-nome"), "O campo <strong>Nome</strong> é obrigatório!");

                if (quantidadeDeErros > 0) posicao = 2;

                console.error("Total de erros:", quantidadeDeErros);
                break;
            case 4:
                if (quantidadeDeErros > 0) posicao = 3;
                break;
            case 5:
                if (quantidadeDeErros > 0) posicao = 4;
                break;
            case 6:
                if (quantidadeDeErros > 0) posicao = 5;
                break;
            case 7:
                if (quantidadeDeErros > 0) posicao = 6;
                break;
            default:
                break;
        }
    }

    const init = () => {
        document.forms[0].reset();

        chkLGPD.addEventListener("click", (e) => aceitarTermos(e));
        btnVoltar.addEventListener("click", () => voltarEtapa());
        btnAvancar.addEventListener("click", () => avancarEtapa());
        btnCancelar.addEventListener("click", () => recarregar());

        const bloquearPressaoDaTeclaEnter = () => {
            window.addEventListener("keypress", (e) => {
                if (e.keyCode === 13) e.preventDefault();
            });
        }

        const definirAnoAtual = () => _q("footer span").textContent = new Date().getFullYear();

        const gerenciarBootstrap = () => {
            $(function () {
                $('[data-toggle="popover"]').popover();
            });
        }

        bloquearPressaoDaTeclaEnter();
        definirAnoAtual();
        gerenciarBootstrap();

        redefinirEtapa();
        gerenciarResponsividade();
        mascararCampos();
    }

    init();
})();