function filtrarAluno() {
    const
        nome = document.querySelector("#txt-filtro-aluno-lista-notas"),
        filtro = nome.value.toUpperCase(),
        tabela = document.querySelector("#tb-notas"),
        tr = tabela.querySelectorAll("tbody tr");

    for (let i = 0; i < tr.length; i++) {
        let td = tr[i].querySelectorAll("td")[1];

        if (td) {
            let valor = td.textContent || td.innerText;

            if (valor.toUpperCase().indexOf(filtro) > -1) {
                tr[i].removeAttribute("style", "display");
            } else {
                tr[i].setAttribute("style", "display: none");
            }
        }
    }
}

function limparFiltro() {
    const
        nome = document.querySelector("#txt-filtro-aluno-lista-notas"),
        restaurar = document.querySelectorAll("#tb-notas tbody tr");

    nome.value = "";

    restaurar.forEach(x => {
        x.removeAttribute("style", "display");
    });
}

function imprimirTurmaNoTituloDoContainer() {
    const
        turma = document.querySelector("#txt-nome-turma-selecionada-notas"),
        titulo = document.querySelector(".realcar-aula-turma-professor");

    turma.textContent = titulo.innerText;
}
// imprimirTurmaNoTituloDoContainer();

function obterDadosAlunoAoAbrirModal(info) {
    //console.log(info);

    const
        dados = info.dataset,
        modal = document.querySelector("#md-cadastrar-desempenho-do-aluno");

    modal.querySelector(".modal-title-nome-aluno").innerHTML = `<strong>${dados.nome}</strong> - ${dados.atividade}`;
    modal.querySelector("#container-tarefas").dataset.codigoMatricula = dados.matricula;
    modal.querySelector("#container-tarefas").dataset.componenteCurricular = dados.componenteCurricular;
}

function validarNumeroDecimal(campo) {
    const regExp = new RegExp("[^0-9,]", "g");

    if (campo.value === "00") campo.value = 0.0;
    if (campo.value === ",") campo.value = "";
    if (campo.value.includes(",,")) campo.value = "";

    campo.value = campo.value.replace(regExp, "");

    if (campo.value == "") return false;

    const valor = parseFloat(campo.value.replace(",", "."));

    if (valor > 10) {
        campo.value = 10;

        const 
            contentClassList = "modal-danger",
            iClassList = "glyphicon glyphicon-remove-circle",
            message = "O valor máximo permitido é dez (10)";
        
        modalMsg(contentClassList, iClassList, message);
    }

    if (campo.value.length >= 3) {
        const valor = parseFloat(campo.value.replace(",", "."));

        campo.value = valor.toString().replace(".", ",");
    }

    if (valor < 5) campo.style.color = "#F44336";
    else campo.style.color = "#2196F3";
}

function tratarValorDecimalEmDesfoqueDoCampo(campo) {
    const numeroMaximoDeExecucoes = 10;

    for (let i = 0; i < numeroMaximoDeExecucoes; i++) {
        if (campo.value === `${i}`) campo.value = `${i},0`;
        if (campo.value === `${i},`) campo.value = `${i},0`;
    }

    if (campo.value === "10,") campo.value = 10;
}

function calcularMediaDasAtividadesDoAluno(AtividadeAluno) {
    const
        grupoDeAtividades = document.querySelectorAll("[data-grupo_de_atividades_matricula]"),
        atividade = document.querySelectorAll("[data-atividade_matricula]"),
        notaFinal = document.querySelectorAll("[data-nota_final_matricula]");

    for (let i = 0; i < notaFinal.length; i++) {

        //busca na tabela as células referentes ao aluno
        if (grupoDeAtividades[i].dataset.grupo_de_atividades_matricula === notaFinal[i].dataset.nota_final_matricula &&
            AtividadeAluno.dataset.atividade_matricula === notaFinal[i].dataset.nota_final_matricula) {

            let
                somaDasAtividades = 0.0,
                quantidadeDeAtividades = grupoDeAtividades[i].children.length,
                mediaDasAtividades;

            for (let i = 0; i < atividade.length; i++) {

                //verifica se a célula digitada faz parte das células de atividades do aluno
                if (atividade[i].dataset.atividade_matricula === AtividadeAluno.dataset.atividade_matricula) {
                    somaDasAtividades += converterValorDaNotaParaDecimal(atividade[i].value);
                }
            }

            mediaDasAtividades = (somaDasAtividades / quantidadeDeAtividades).toFixed(1);
            notaFinal[i].value = mediaDasAtividades;

            //tratamento da nota final do aluno
            const valor = parseFloat(notaFinal[i].value.replace(",", ".")).toFixed(1);

            notaFinal[i].value = valor.toString().replace(".", ",");

            if (valor < 5) notaFinal[i].style.color = "#F44336";
            else notaFinal[i].style.color = "#2196F3";
        }
    }
}

function calcularMediaDeNotasDoAluno(nota1, nota2, nota3) {
    nota1 = converterValorDaNotaParaDecimal(nota1);
    nota2 = converterValorDaNotaParaDecimal(nota2);
    nota3 = converterValorDaNotaParaDecimal(nota3);

    const mediaDasNotas = ((nota1 + nota2 + nota3) / 3).toFixed(1);

    return mediaDasNotas;
}

function converterValorDaNotaParaDecimal(nota) {
    if (nota.includes(",")) {
        nota = nota.replace(",", ".");

        nota = parseFloat(nota);
    } else nota = parseFloat(nota);

    if (isNaN(nota)) nota = 0.0

    return nota;
}

function enviarDadosDasNotasParaGravacao() {
    const
        modal = document.querySelector("#md-notas"),
        tabela = modal.querySelector("#md-tb-notas"),
        campoNota1 = modal.querySelector("#nota-1"), // Permanece por hora
        campoNota2 = modal.querySelector("#nota-2"),
        campoNota3 = modal.querySelector("#nota-3");

    calcularMediaDeNotasDoAluno(campoNota1.value, campoNota2.value, campoNota3.value);

    let arrNotasDoTrimestre = new Array();

    const camposNotasPorTrimestre = document.querySelectorAll("[data-trimestre]");

    for (var i = 0; i < camposNotasPorTrimestre.length; i++) {
        const obj = {
            Matricula: tabela.dataset.codigoMatricula,
            ComponenteCurricular: tabela.dataset.componenteCurricular,
            Trimeste: camposNotasPorTrimestre[i].dataset.trimestre,
            Nota: camposNotasPorTrimestre[i].value !== "" ? camposNotasPorTrimestre[i].value.replace(",", ".") : null
        }

        arrNotasDoTrimestre.push(obj);
    }

    $.ajax({
        type: "POST",
        url: '@Url.Action("SalvarNotas", "Notas")',
        data: {
            notasTrimestre: JSON.stringify(arrNotasDoTrimestre)
        },
        cache: false,
        success: function (data) {
            //console.log(data);
            // TODO: menssagem de sucesso aqui!

        },
        error: function (xhr, status, error) {
            console.error(xhr);
        },
    });
}

function tratarIconeDasNotas(campo) {
    const
        valor = parseFloat(campo.value),
        icon = document.querySelectorAll("[data-ico_atividade]"),
        ico_nota_azul = document.querySelectorAll(".ico-nota-azul"),
        ico_nota_vermelha = document.querySelectorAll(".ico-nota-vermelha");

    let atividade = campo.dataset.atividade;

    for (let i = 0; i < icon.length; i++) {
        let
            ico_atividade = icon[i].dataset.ico_atividade,
            numero_chamada_aluno = icon[i].dataset.numero_chamada;

        if (atividade === ico_atividade && campo.id === numero_chamada_aluno) {
            if (valor < 5) {
                ico_nota_azul[i].style = "display: none";
                ico_nota_vermelha[i].style = "display: block";
            } else {
                ico_nota_azul[i].style = "display: block";
                ico_nota_vermelha[i].style = "display: none";
            }
        }
    }
}

function destacarAtividadeSelecionada(atividade) {
    if (atividade.classList.contains("checked")) {
        atividade.classList.remove("checked");
        atividade.children[0].classList.remove("glyphicon-check");
        atividade.children[0].classList.add("glyphicon-unchecked");
    } else {
        atividade.classList.add("checked");
        atividade.children[0].classList.add("glyphicon-check");
        atividade.children[0].classList.remove("glyphicon-unchecked");
    }
}

function ConfirmarExcluirAtividadesSelecionadas() {
    const 
        atividades = document.querySelector("#container-check-delete-atividade"),
        ul = document.querySelector("#checked-list");

    //exclui qualquer lista de tarefas criada anteriormente 
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.firstChild);
    }

    for (let i = 0; i < atividades.children.length; i++) {
        //se alguma tarefa foi selecionada
        if (atividades.children[i].classList.contains("checked")) {

            //cria uma lista com todas as tarefas selecionadas
            const
                li = document.createElement("li"),
                node = document.createTextNode(atividades.children[i].innerText);

            li.appendChild(node);
            ul.appendChild(li);

            //exibe a modal de confirmação
            $("#md-confirmar-excluir-tarefa").modal("show");
        }
    }

    //se nunhuma tarefa foi selecionada
    if (ul.hasChildNodes() == false) {
        const 
            contentClassList = "modal-danger",
            iClassList = "glyphicon glyphicon-remove-circle",
            message = "Nenhuma tarefa foi selecionada.";
        
        modalMsg(contentClassList, iClassList, message);
    }
}

function modalMsg(contentClassList, iClassList, message) {

    const 
        i = document.createElement("i"),
        nodeMsg = document.createTextNode(message),
        msgContent = document.querySelector("#msg-content");

    //exclui qualquer menssagem existente na modal message
    while (msgContent.hasChildNodes()) {
        msgContent.removeChild(msgContent.firstChild);
    }

    //cria uma nova menssagem na modal message
    i.className = iClassList;
    msgContent.classList.add(contentClassList);

    msgContent.appendChild(i);
    msgContent.appendChild(nodeMsg);

    $("#modal-msg").modal("show");

    setTimeout(function () {
        $('#modal-msg').modal('hide');
    }, 2000);
}

function excluirAtividadesSelecionadas() {
    const
        atividades = document.querySelector("#container-check-delete-atividade");

    for (let i = 0; i < atividades.children.length; i++) {
        //se alguma tarefa foi selecionada
        if (atividades.children[i].classList.contains("checked")) {
            console.log("atividade na posição " + (i + 1) + " selecionada");
            console.log(atividades.children[i]);
        }
    }
}

function AbrirPopover() {
    $(function () {
        $('[data-toggle="popover"]').popover({
            container: '#tb-notas-container'
        })
    })
}
