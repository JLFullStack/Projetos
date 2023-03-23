(function () {
    "use strict";

    const listaDeArquivosAceitos = {
        formatos: {
            jpeg: "image/jpeg",
            jpg: "image/jpg"
        }
    }

    function aplicarMascaraNoFormularioDeArquivos() {
        const
            btnMascara = document.querySelector("#btn-mascara-form-upload"),
            input = document.querySelector("#input-arquivos-form-upload");

        let arquivos;

        //Ao clicar no botão de máscara um evento de clique aciona a input 
        btnMascara.addEventListener("click", () => {
            input.click();
        });

        //evento é acionado toda vez que o valor da inputFiles é modificado
        input.addEventListener("change", (e) => {
            arquivos = e.target.files;
            listarArquivosSelecionados(arquivos);
        });

        //evento é acionado ao arrastar o arquivo
        btnMascara.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        //evento é acionado ao soltar o arquivo
        btnMascara.addEventListener("drop", (e) => {
            e.preventDefault();

            arquivos = e.dataTransfer.files;
            listarArquivosSelecionados(arquivos);
        });

        function listarArquivosSelecionados(arquivos) {
            const
                lista = document.querySelector("#lista-arquivos-form-upload"),
                grupoBtn = document.querySelector("#grupo-btn-form-upload"),
                btnLimparFormulario = document.querySelector("#btn-limpar-form-upload"),
                msg = document.querySelector("#msg-aquivo-form-upload");

            let quantidadeDeArquivos = arquivos.length;

            lista.innerHTML = "";
            msg.innerHTML = "";

            if (quantidadeDeArquivos != 0) {
                grupoBtn.style = "display: block";
                lista.style = "display: block";
                lista.style = "display: flex";
                msg.classList.remove("m-5");

                //percorre o objeto de arquivos aceitos   
                for (const arquivo of arquivos) {
                    if (arquivo.type === listaDeArquivosAceitos.formatos.jpg ||
                        arquivo.type === listaDeArquivosAceitos.formatos.jpeg) {

                        //cria um novo objeto para leitura de arquivo
                        let fileReader = new FileReader();

                        fileReader.onload = () => {
                            let fileURL = fileReader.result; //passando a fonte do arquivo do usuário na variável fileURL

                            //adiciona o arquivo e suas características na lista
                            lista.innerHTML += `<li class="list-group-item mt-3 text-blue">
                                                    <div>
                                                        <img class="me-4" src="${fileURL}" alt="image"\> ${arquivo.name} 
                                                    <\div>
                                            </li>`;
                        }
                        fileReader.readAsDataURL(arquivo);
                    } else
                        lista.innerHTML += `<li class="list-group-item mt-3 text-red">${arquivo.name}</li>`;
                }

                if (quantidadeDeArquivos === 1)
                    msg.innerHTML = `<msg> ${quantidadeDeArquivos} arquivo selecionado </msg>`;

                if (quantidadeDeArquivos > 1)
                    msg.innerHTML = `<msg> ${quantidadeDeArquivos} arquivos selecionados </msg>`;

                //evento limpa a seleção de arquivos e os detalhes de upload
                btnLimparFormulario.addEventListener("click", () => {
                    limparFormularioUploadDeArquivos();
                });
            }
        };
    }
    aplicarMascaraNoFormularioDeArquivos();

    function limparFormularioUploadDeArquivos() {
        const
            input = document.querySelector("#input-arquivos-form-upload"),
            lista = document.querySelector("#lista-arquivos-form-upload"),
            msg = document.querySelector("#msg-aquivo-form-upload"),
            grupoBtn = document.querySelector("#grupo-btn-form-upload");

        input.value = "";
        lista.innerHTML = "";
        lista.style = "display:none";
        grupoBtn.style = "display:none";
        msg.innerHTML = `<i class="fas fa-times-circle fa-4x text-dark-5"></i> 
                        <msg class="text-dark-5">nenhuma imagem selecionada</msg>`;
        msg.classList.add("m-5");
    }

    function validarFormularioDeArquivos() {
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

                    if (tipoDoArquivo !== listaDeArquivosAceitos.formatos.jpg) arquivoValido = false;

                    if (!arquivoValido) {
                        event.preventDefault();
                        msgArquivoInvalido.style = "display:block";
                    }
                }

                if (arquivoValido) {
                    tornarAssincronoUploadDeArquivos();
                    limparFormularioUploadDeArquivos();
                }
            }
        });
    };

    function tornarAssincronoUploadDeArquivos() {
        const
            input = document.querySelector("#input-arquivos-form-upload"),
            files = $(input).get(0).files,
            formData = new FormData(),
            description = document.querySelector("#descricao-arquivos-form-upload");

        //Percorre os arquivos selecionados na input adicionando-os na "formData"
        for (var i = 0; i !== files.length; i++) {
            formData.append("files", files[i]);
        }

        //Adiciona o valor da descrição na "formData" junto aos arquivos
        formData.append("description", description.value);

        //Envia os arquivos e a descrição de upload para o método post "Upload"
        $.ajax({
            type: "POST",
            url: "/File/Upload",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (result, status, xhr, data) {

                //Evento atualiza somente a tabela com a lista de arquivos, tornando assíncrona a view Index
                $("#container-tb-lista-arquivos-upload").load('@Url.Action("_FileList", "File")');
            },
            error: function (result, xhr, status, error) {

            }
        });
    }

    function obterDadosDoArquivoAoAbrirModal(dados) {
        const
            id = dados.dataset.id_arquivo,
            nomeArquivo = dados.dataset.nome_arquivo,
            tipoArquivo = dados.dataset.tipo_arquivo,
            dataUpload = dados.dataset.dt_upload_arquivo,
            btnExcluirArquivo = document.querySelector("#btn-excluir-arquivo-upload"),
            lista = document.querySelector("#dados-arquivo-md-confirmar-excluir-arquivo-upload");

        lista.innerHTML = ""

        lista.innerHTML = `
                    <li><strong>Nome:</strong> ${nomeArquivo}</li>
                    <li><strong>Tipo:</strong> ${tipoArquivo}</li>
                    <li><strong>Data:</strong> ${dataUpload} </li>
                    `;

        btnExcluirArquivo.setAttribute('onclick', `tornarAssincronaExclusaoDeArquivo(${id})`);
    }

    function tornarAssincronaExclusaoDeArquivo(id) {

        //Envia o id do arquivo a ser deletado para o método Delete
        $.ajax({
            type: "DELETE",
            url: "/File/Delete",
            data: {
                id: id,
            },
            beforeSend: function (data) {
                $('#md-confirmar-excluir-arquivo-upload').modal('hide');
            },
            success: function (result, status, xhr) {

                //Evento atualiza somente a tabela com a lista de arquivos, tornando assíncrona a view Index
                $("#container-tb-lista-arquivos-upload").load('@Url.Action("_FileList", "File")');
            },
            error: function (result, xhr, status, error) {

            }
        });
    }

})();