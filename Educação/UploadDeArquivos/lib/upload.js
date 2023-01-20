(function () {
    /** @function function */
    /**
     * @version 1.0.0 - 11/01/2023
     * @description Função anônima é uma boa prática para aumentar a segurança do projeto. O usuário não consegue acessar o seu escopo.
     * @example (function(){
     *              //ao tentar acessar está variável, para o usuário aparecerá como indefinida. 
     *              //Isto acontece com qualquer coisa declarada dentro do corpo da função anônima
     *              var x = 0; 
     *          })();
     */

    //Define que o código JavaScript deve ser executado em "modo estrito". Não podendo, por exemplo, usar variáveis ​​não declaradas.
    "use strict";

    function enviarListaDeArquivosParaFuncoes() {
        //objeto contém uma lista com todos os arquivos aceitos para upload
        const listaDeArquivosAceitos = {
            formatos: {
                pdf: "application/pdf",
                docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }
        }

        //lista de funções que utilizam o objeto 
        listarArquivosSelecionados(listaDeArquivosAceitos)
        validarFormularioDeArquivos(listaDeArquivosAceitos);
    }
    enviarListaDeArquivosParaFuncoes();

    function aplicarMascaraNoFormularioDeArquivos() {
        const
            btnMascara = document.querySelector("#btn-mascara-form-upload"),
            inputFiles = document.querySelector("#input-arquivos-form-upload");

        //Ao clicar no botão de máscara um evento de clique aciona a inputFiles 
        btnMascara.addEventListener("click", () => {
            inputFiles.click();
        });
    }
    aplicarMascaraNoFormularioDeArquivos();

    function listarArquivosSelecionados(listaDeArquivosAceitos) {
        const
            inputFiles = document.querySelector("#input-arquivos-form-upload"),
            inputMascara = document.querySelector("#input-mascara-form-upload"),
            lista = document.querySelector("#lista-arquivos-form-upload"),
            btnLimparFormulario = document.querySelectorAll(".btn-limpar-form-upload"),
            msgArquivoInvalido = document.querySelector("#msg-aquivo-invalido-form-upload"),
            msgListaVazia = document.querySelector("#msg-lista-vazia-form-upload");

        //evento é acionado toda vez que o valor da inputFiles é modificado
        inputFiles.addEventListener("change", (e) => {
            let arquivos = e.target.files;
            let quantidadeDeArquivos = arquivos.length;

            if (quantidadeDeArquivos === 0)
                inputMascara.value = "";

            if (quantidadeDeArquivos === 1)
                inputMascara.value = `${arquivos.length} arquivo selecionado`;

            if (quantidadeDeArquivos > 1)
                inputMascara.value = `${arquivos.length} arquivos selecionados`;

            lista.innerHTML = "";
            msgArquivoInvalido.style = "display:none";
            msgListaVazia.style = "display:none";

            //percorre o objeto de arquivos aceitos
            for (const arquivo of arquivos) {
                if (arquivo.type === listaDeArquivosAceitos.formatos.pdf ||
                    arquivo.type === listaDeArquivosAceitos.formatos.docx)
                    lista.innerHTML += `<li class="list-group-item arquivo-valido">${arquivo.name}</li>`;
                else
                    lista.innerHTML += `<li class="list-group-item arquivo-invalido">${arquivo.name}</li>`;
            }
        });

        //evento limpa a seleção de arquivos e os detalhes de upload
        btnLimparFormulario.forEach(btn => {
            btn.addEventListener("click", () => {
                limparFormularioUploadDeArquivos();
            });
        });
    };

    function limparFormularioUploadDeArquivos() {
        const
            inputFiles = document.querySelector("#input-arquivos-form-upload"),
            inputMascara = document.querySelector("#input-mascara-form-upload"),
            lista = document.querySelector("#lista-arquivos-form-upload"),
            textoDescricao = document.querySelector("#descricao-arquivos-form-upload"),
            msgArquivoInvalido = document.querySelector("#msg-aquivo-invalido-form-upload"),
            msgListaVazia = document.querySelector("#msg-lista-vazia-form-upload");

        inputFiles.value = "";
        lista.innerHTML = "";
        inputMascara.value = "";
        textoDescricao.value = "";
        msgArquivoInvalido.style = "display:none";
        msgListaVazia.style = "display:none";
    }

    function validarFormularioDeArquivos(listaDeArquivosAceitos) {
        const
            btnSalvar = document.querySelector("#btn-salvar-form-upload"),
            inputFiles = document.querySelector("#input-arquivos-form-upload"),
            lista = document.querySelector("#lista-arquivos-form-upload"),
            msgArquivoInvalido = document.querySelector("#msg-aquivo-invalido-form-upload"),
            msgListaVazia = document.querySelector("#msg-lista-vazia-form-upload");

        btnSalvar.addEventListener("click", () => {
            let arquivoValido = true;
            const arquivos = inputFiles.files;

            if (lista.innerHTML == "") {
                event.preventDefault();
                msgListaVazia.style = "display:block";
            }

            if (lista.innerHTML != "") {
                //percorre a lista de arquivos selecionados
                for (const arquivo of arquivos) {
                    let tipoDoArquivo = arquivo.type;

                    if (tipoDoArquivo !== listaDeArquivosAceitos.formatos.pdf &&
                        tipoDoArquivo !== listaDeArquivosAceitos.formatos.docx) {
                        arquivoValido = false;
                    }

                    if (!arquivoValido){
                        event.preventDefault();
                        msgArquivoInvalido.style = "display:block";
                    }
                }

                if (arquivoValido) {
                    limparFormularioUploadDeArquivos();
                }
            }
        });
    };
})();

function filtrarArquivo() {
    const
        filtro = document.querySelector("#input-filtro-arquivos-upload").value.toUpperCase(),
        tr = document.querySelectorAll("#tb-lista-arquivos-upload tbody tr");

    for (let i = 0; i < tr.length; i++) {
        let td = tr[i].querySelectorAll("td")[0];

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
        filtro = document.querySelector("#input-filtro-arquivos-upload"),
        restaurar = document.querySelectorAll("#tb-lista-arquivos-upload tbody tr");

    filtro.value = "";

    restaurar.forEach(x => {
        x.removeAttribute("style", "display");
    });
}

function obterDescricaoDoArquivoAoAbrirModal(valor) {
    const
        descricao = valor.dataset.ds_arquivo,
        conteudoModal = document.querySelector("#md-descricao-tb-lista-arquivos-upload #conteudo-md-descricao-tb-lista-arquivos-upload");

    conteudoModal.innerHTML = "";

    if (descricao == "") {
        conteudoModal.innerHTML = "Nenhum detalhe registrado";
    } else {
        conteudoModal.innerHTML = descricao;
    }
};

function obterDadosDoArquivoAoAbrirModal(dados) {
    const
        nomeArquivo = dados.dataset.nome_arquivo,
        tipoArquivo = dados.dataset.tipo_arquivo,
        dataUpload = dados.dataset.dt_upload_arquivo,
        lista = document.querySelector("#dados-arquivo-md-confirmar-excluir-arquivo-upload");

    lista.innerHTML = ""

    lista.innerHTML = ` <li><strong>Nome:</strong> ${nomeArquivo}</li>
                        <li><strong>Tipo:</strong> ${tipoArquivo}</li>
                        <li><strong>Data:</strong> ${dataUpload} </li>`;
}

    //formato mais utilizado para validação
    // btnSalvar.addEventListener("click", () => {
    //     let validadeArquivo = true;
    //     const arquivos = input.files;

    //     for (const arquivo of arquivos) {
    //         let tipoDoArquivo = arquivo.type;

    //         const verificarArquivosAceitos = 
    //             tipoDoArquivo === "application/pdf" || 
    //             tipoDoArquivo === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    //         if(!verificarArquivosAceitos)
    //             validadeArquivo = false;

    //         if (!validadeArquivo)
    //             event.preventDefault();
    //     }
    // });