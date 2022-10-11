function imprimirTurmaNoTituloDoContainer() {
    // const
    //     turma = document.querySelector("#txt-nome-turma-selecionada-notas"),
    //     titulo = document.querySelector(".realcar-aula-turma-professor");

    // turma.textContent = titulo.innerText;

    const
        turma = document.querySelector("#txt-nome-turma-selecionada-notas"),
        titulo = "1° Ano A Inglês";

    turma.textContent = titulo;
}
imprimirTurmaNoTituloDoContainer();

function verificarExistenciaDeAtividades() {
    const
        atividades = document.querySelectorAll(".form-atividades"),
        btnEditar = document.querySelector("#btn-editar-atividade"),
        btnExcluir = document.querySelector("#btn-excluir-atividade");

    if (atividades.length == 0) {
        btnEditar.style = "display:none";
        btnExcluir.style = "display:none";
    }

}
verificarExistenciaDeAtividades();

function estilizarValoresNotasObtidasNoBD() {
    const td = document.querySelectorAll("tbody #tb-notas-atividades .form-atividades");
    td.forEach(x => {
        let
            ipt = x.querySelector("input"),
            vlr = ipt.value;
        if (parseInt(vlr) > 6) {
            x.querySelector("input").style.color = "rgb(33, 150, 243)";
            validarNumeroDecimal(x.querySelector("input"));
            tratarIconeDasNotas(x.querySelector("input"));
        } else {
            x.querySelector("input").style.color = "rgb(244, 67, 54)";
            validarNumeroDecimal(x.querySelector("input"));
            tratarIconeDasNotas(x.querySelector("input"));
        }
    });
}
estilizarValoresNotasObtidasNoBD();

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

function validarNumeroDecimal(campo) {
    const
        regExp = new RegExp("[^0-9,]", "g"),
        valor = parseFloat(campo.value.replace(",", "."));  

    if (campo.value === "00") campo.value = 0.0;
    if (campo.value === ",") campo.value = "";
    if (campo.value.includes(",,")) campo.value = "";

    campo.value = campo.value.replace(regExp, "");

    if (campo.value == "") return false;

    //verifica a existência do peso na input
    if (campo.dataset.peso_atividade == null) {
        if (valor > 10) {
            campo.value = 10;

            enviarMenssagemDeAlerta(
                "modal-danger",
                "glyphicon glyphicon-remove-circle",
                "O valor máximo permitido é dez (10)"
            );
        }

        if (valor < 5) {
            campo.style.color = "#F44336";
        } else campo.style.color = "#2196F3";

    } else {
        const peso_atividade = converterValorDaNotaParaDecimal(campo.dataset.peso_atividade);

        if (valor > peso_atividade) {
            campo.value = peso_atividade;

            enviarMenssagemDeAlerta(
                "modal-danger",
                "glyphicon glyphicon-remove-circle",
                "O valor máximo permitido é " + peso_atividade
            );
        }

        if (valor < peso_atividade / 2) {
            campo.style.color = "#F44336";
        } else campo.style.color = "#2196F3";
    }

    if (campo.value.length >= 3) {
        const valor = parseFloat(campo.value.replace(",", "."));

        campo.value = valor.toString().replace(".", ",");
    }
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
        atividade = document.querySelectorAll("[data-atividade_matricula]"),
        notaFinal = document.querySelectorAll("[data-nota_final_matricula]"),
        grupoDeAtividades = document.querySelectorAll("[data-grupo_de_atividades_matricula]");

    for (let i = 0; i < notaFinal.length; i++) {

        //busca na tabela as células referentes ao aluno
        if (grupoDeAtividades[i].dataset.grupo_de_atividades_matricula === notaFinal[i].dataset.nota_final_matricula &&
            AtividadeAluno.dataset.atividade_matricula === notaFinal[i].dataset.nota_final_matricula) {

            let
                mediaDasAtividades,
                somaDasAtividades = 0.0,
                quantidadeDeAtividades = grupoDeAtividades[i].children.length;
                

            for (let i = 0; i < atividade.length; i++) {

                //verifica se a célula digitada faz parte das células de atividades do aluno
                if (atividade[i].dataset.atividade_matricula === AtividadeAluno.dataset.atividade_matricula) {
                    let 
                        vl_nota_atividade = converterValorDaNotaParaDecimal(atividade[i].value),
                        peso_atividade = converterValorDaNotaParaDecimal(atividade[i].dataset.peso_atividade),
                        nota_atividade_pelo_peso = vl_nota_atividade / peso_atividade;

                    somaDasAtividades += nota_atividade_pelo_peso;
                }
            }

            mediaDasAtividades = (somaDasAtividades / quantidadeDeAtividades).toFixed(1);
            notaFinal[i].value = mediaDasAtividades * 10;

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
        icon = document.querySelectorAll("[data-ico_atividade]"),
        ico_nota_azul = document.querySelectorAll(".ico-nota-azul"),
        ico_nota_vermelha = document.querySelectorAll(".ico-nota-vermelha"),
        peso_atividade = converterValorDaNotaParaDecimal(campo.dataset.peso_atividade),
        descricaoDesempenhoAluno = ((campo.previousElementSibling).firstElementChild).firstElementChild;

    //verifica se existe alguma descrição de desempenho cadastrada
    if (descricaoDesempenhoAluno.innerHTML != "nenhum desempenho cadastrado"){
        valor = converterValorDaNotaParaDecimal(campo.value);
    } else valor = parseFloat(campo.value.replace(",", "."));
        
    let atividade = campo.dataset.atividade;

    for (let i = 0; i < icon.length; i++) {
        let
            ico_atividade = icon[i].dataset.ico_atividade,
            numero_chamada_aluno = icon[i].dataset.numero_chamada;

        if (atividade === ico_atividade && campo.id === numero_chamada_aluno) {
            if (valor < peso_atividade / 2) {
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
    if (ul.hasChildNodes() == true) {
        while (ul.hasChildNodes()) {
            ul.removeChild(ul.firstChild);
        }
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
        enviarMenssagemDeAlerta(
            "modal-danger",
            "glyphicon glyphicon-remove-circle",
            "Nenhuma tarefa foi selecionada."
        );
    }
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

function enviarMenssagemDeAlerta(contentClassList, iClassList, message) {
    const
        i = document.createElement("i"),
        nodeMsg = document.createTextNode(message),
        msgContent = document.querySelector(".alert-content");

    //exclui qualquer menssagem existente na modal message
    if (msgContent.hasChildNodes() == true) {
        while (msgContent.hasChildNodes()) {
            msgContent.removeChild(msgContent.firstChild);
        }
    }

    //cria uma nova menssagem na modal message
    i.className = iClassList;
    msgContent.classList.remove("modal-danger");
    msgContent.classList.remove("modal-primary");
    msgContent.classList.remove("modal-warning");
    msgContent.classList.add(contentClassList);

    msgContent.appendChild(i);
    msgContent.appendChild(nodeMsg);

    $("#modal-msg").modal("show");

    setTimeout(function () {
        $('#modal-msg').modal('hide');
    }, 2000);
}

function AbrirPopover() {
    $(function () {
        $('[data-toggle="popover"]').popover({
            container: '#tb-notas-container'
        })
    })
}

function validarCamposMdCadastrarTarefa() {
    const 
        tipoTarefa = document.querySelector("#campo-tipo-tarefa-md-cadastrar-tarefa"),
        peso = document.querySelector("#campo-peso-md-cadastrar-tarefa"),
        titulo = document.querySelector("#campo-titulo-md-cadastrar-tarefa"),
        msg = document.querySelector("#msg-alerta-md-cadastrar-tarefa");

    // desabilita o envio do formulário se houverem campos obrigatórios não preenchidos
    if (tipoTarefa.selectedIndex === 0 || peso.value == "" || titulo.value == "") {
        event.preventDefault();

        msg.style = "opacity:100%";

        setTimeout(function () {
            msg.style = "opacity:0%";
        }, 2000);

        deixarCampoDinamico(tipoTarefa);
        deixarCampoDinamico(peso);
        deixarCampoDinamico(titulo);
    }
}

function validarCamposMdEditarTarefa() {
    const 
        tarefa = document.querySelector("#campo-tarefa-md-editar-tarefa"),
        peso = document.querySelector("#campo-peso-md-editar-tarefa"),
        titulo = document.querySelector("#campo-titulo-md-editar-tarefa"),
        msg = document.querySelector("#msg-alerta-md-editar-tarefa");

    // desabilita o envio do formulário se houverem campos obrigatórios não preenchidos
    if (tarefa.selectedIndex === 0 || peso.value == "" || titulo.value == "") {
        event.preventDefault();

        msg.style = "opacity:100%";

        setTimeout(function () {
            msg.style = "opacity:0%";
        }, 2000);

        deixarCampoDinamico(tarefa);
        deixarCampoDinamico(peso);
        deixarCampoDinamico(titulo);
    }
}

function validarCampoMdCadastrarDesempenhoDoAluno() {
        const 
            txtDesempenhoAluno = document.querySelector("#txt-descricao-atividade"),
            msg = document.querySelector("#msg-alerta-md-cadastrar-desempenho-do-aluno"),
            modalBody = document.querySelector("#md-cadastrar-desempenho-do-aluno .modal-body");

    // desabilita o envio do formulário se houverem campos obrigatórios não preenchidos
    if (txtDesempenhoAluno.value == "") {
        event.preventDefault();

        modalBody.classList.add("mostrar-menssagem-de-alerta");
    
        setTimeout(function () {
            msg.style = "opacity:100%";
        }, 100);

        setTimeout(function () {
            msg.style = "opacity:0%";
        }, 2000);

        setTimeout(function () {
            modalBody.classList.remove("mostrar-menssagem-de-alerta");
        }, 2200);

        deixarCampoDinamico(txtDesempenhoAluno);
    }
}

function obterDadosAlunoAoAbrirModal(info) {
    const
        dados = info.dataset,
        modal = document.querySelector("#md-cadastrar-desempenho-do-aluno");

    modal.querySelector(".modal-title-nome-aluno").innerHTML = `<strong>${dados.nome}</strong> - ${dados.atividade}`;
    modal.querySelector("#container-tarefas").dataset.codigoMatricula = dados.matricula;
    modal.querySelector("#container-tarefas").dataset.componenteCurricular = dados.componenteCurricular;
    modal.querySelector("#txt-descricao-atividade").value = dados.desempenho_do_aluno;
}

function destacarTarefasComDesempenhoCadastrado() {
const descricaoDesempenhoAluno = document.querySelectorAll(".descricao-desempenho");

for (let i = 0; i < descricaoDesempenhoAluno.length; i++) {

    //verifica se existe alguma descrição de desempenho cadastrada
    if (descricaoDesempenhoAluno[i].innerHTML.trim() != "Nenhum desempenho cadastrado") {

        const atividade = descricaoDesempenhoAluno[i].closest("div.form-atividades");
        let
            valorAtividade = converterValorDaNotaParaDecimal(atividade.lastElementChild.value),
            pesoAtividade = converterValorDaNotaParaDecimal(atividade.lastElementChild.dataset.peso_atividade);

        if (valorAtividade < pesoAtividade / 2) {
            atividade.classList.add("destaque-desempenho-negativo");
            atividade.classList.remove("destaque-desempenho-positivo");
        } else{
            atividade.classList.add("destaque-desempenho-positivo");
            atividade.classList.remove("destaque-desempenho-negativo");
        }
    }  
}
} destacarTarefasComDesempenhoCadastrado();

function deixarCampoDinamico(campo) {
    if (campo.value == "" || campo.selectedIndex === 0) {
        campo.classList.add("campo-invalido");
        campo.classList.add("background-campo-invalido");
        campo.classList.remove("campo-valido");
        campo.classList.remove("background-campo-valido");

        if (campo.previousElementSibling != null) {
            campo.previousElementSibling.classList.add("campo-invalido");
            campo.previousElementSibling.classList.remove("campo-valido");
        }
        
    } else{
        campo.classList.add("campo-valido");
        campo.classList.add("background-campo-valido");
        campo.classList.remove("campo-invalido");
        campo.classList.remove("background-campo-invalido");
        
        if (campo.previousElementSibling != null) {
            campo.previousElementSibling.classList.add("campo-valido");
            campo.previousElementSibling.classList.remove("campo-invalido");
        }
    }
}

function mapearTabelaNotas() {
    let
        iColuna = 1,
        linha = document.querySelectorAll("#tb-notas tbody tr"),
        input = document.querySelectorAll("#tb-notas tbody input");

    //adiciona o indice nas linhas da tabela
    for (let i = 0; i < linha.length; i++) {
        linha[i].setAttribute("data-indice_linha", i);
    }

    //adiciona o indice e o evento onkeydown nas inputs da tabela
    for (let i = 0; i < input.length; i++) {
        input[i].setAttribute("data-indice_input", i);
        input[i].setAttribute('onkeydown', 'focarNaCelulaAbaixo(this, event)');
    }

    //adiciona o indice nas colunas da tabela
    for (let i = 0; i < linha.length; i++) {
        for (let j = 0; j < input.length; j++) {

            let quantInputPorLinha = input.length / linha.length;

            input[j].classList.add("col" +iColuna);
            input[j].setAttribute("data-Col", iColuna);

            iColuna++;

            if (iColuna > quantInputPorLinha) {
                iColuna = 1;
            }
        }
    }
}mapearTabelaNotas();

function focarNaCelulaAbaixo(ipt, event) {
    const 
        linhas = document.querySelectorAll("#tb-notas tbody tr"),
        input = document.querySelectorAll("#tb-notas tbody input");

    let quantInputPorLinha, cellFocoInicio;

    //verifica a quantidade de inputs que tem na mesma linha
    for (let i = 0; i < linhas.length; i++) {
        for (let j = 0; j < input.length; j++) {
            quantInputPorLinha = input.length / linhas.length
        }
    }

    if (ipt != undefined) {
        const 
            tecla = event.code,
            cellFoco = parseInt(ipt.dataset.indice_input) + quantInputPorLinha,
            cellFocoInicio = linhas[0].querySelector(".col" +ipt.dataset.col);

        //verifica o código da tecla pressionada
        if (tecla === "Tab") {

            event.preventDefault(); // bloqueia o padrão da tecla tab

            try {
                document.querySelector("[data-indice_input='" + cellFoco.toString() + "']").focus(); // foca no próximo campo
                document.querySelector("[data-indice_input='" + cellFoco.toString() + "']").select(); // foca no próximo campo

            } catch {
                cellFocoInicio.focus(); // foca no primeiro campo
                cellFocoInicio.select();
            }
        }
    }
} focarNaCelulaAbaixo();

function tratarCampoAunsenciasCompensadas(campo) {
    const 
        regExp = new RegExp("[^0-9,]", "g"),
        falta = document.querySelectorAll(".qtd-faltas"),
        aunsencias = document.querySelectorAll(".ausencias-compensadas input");

//desabilita o campo das ausências compensadas
for (let i = 0; i < aunsencias.length; i++) {

    //verifica se os campos estão na mesma linha
    if (aunsencias[i].closest("tr").dataset.indice_linha == falta[i].closest("tr").dataset.indice_linha) {

        let qtdFaltas = parseInt(falta[i].innerText);

        if (qtdFaltas < 15) {
            aunsencias[i].setAttribute("disabled", true);
        } else{
            
            falta[i].style.color = "#F44336";
        }
    }
}

//trata os campos desabilitados das ausências compensadas 
if (campo != undefined) {
    campo.value = campo.value.replace(regExp, "");

    for (let i = 0; i < falta.length; i++) {

        //verifica se os campos estão na mesma linha
        if (campo.closest("tr").dataset.indice_linha == falta[i].closest("tr").dataset.indice_linha) {

            let qtdFaltas = parseInt(falta[i].innerText);

            if (campo.value > qtdFaltas) {
                campo.value = qtdFaltas;

                enviarMenssagemDeAlerta(
                    "modal-danger",
                    "glyphicon glyphicon-remove-circle",
                    "O valor não pode ser maior do que o das faltas."
                );
            }
        }
    }
}
} tratarCampoAunsenciasCompensadas();
