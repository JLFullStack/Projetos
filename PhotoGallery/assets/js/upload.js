(function () {
    "use strict";

    const acceptedFileList = {
        formats: {
            jpeg: "image/jpeg",
            jpg: "image/jpg"
        }
    };

    //#region Upload Form ----------------------------
    function applyMaskOnFileUploadInput() {
        const
            mask_btn = document.querySelector("#file-input-mask"),
            fileInput = document.querySelector("#file-input");

        let files;

        if (!(fileInput == null)) {
            //event is triggered every time the value of fileInput is modified
            fileInput.addEventListener("change", (e) => {
                files = e.target.files;
                listSelectedFiles(files);
            });
        };

        if (!(mask_btn == null)) {
            //When clicking on the mask button a click event triggers the input
            mask_btn.addEventListener("click", () => {
                fileInput.click();
            });

            //event is triggered when dragging the file
            mask_btn.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            //event is triggered when dropping the file
            mask_btn.addEventListener("drop", (e) => {
                e.preventDefault();

                files = e.dataTransfer.files;
                fileInput.files = files;
                listSelectedFiles(files);
            });
        };

        function listSelectedFiles(files) {
            const
                acceptedFileListCard = document.querySelector("#upload-form-file-list #accepted-file-list-card"),
                unacceptedFileListCard = document.querySelector("#upload-form-file-list #unaccepted-file-list-card"),
                btnGroup = document.querySelector("#upload-form-button-group"),
                clearFormButton = document.querySelector("#clear-upload-form-button"),
                msg = document.querySelector("#upload-form-message");

            let
                ckFiles = true,
                amount_of_files = files.length;

            acceptedFileListCard.innerHTML = "";
            unacceptedFileListCard.innerHTML = "";
            msg.innerHTML = "";

            if (!(amount_of_files == 0)) {
                btnGroup.style = "display: block";
                acceptedFileListCard.style = "display: flex; flex-wrap: wrap;";
                unacceptedFileListCard.style = "display: block";
                msg.classList.remove("m-5");

                //cycle through the accepted files object   
                for (const file of files) {
                    if (file.type === acceptedFileList.formats.jpeg ||
                        file.type === acceptedFileList.formats.jpg) {

                        //create a new object for file reading
                        let fileReader = new FileReader();

                        fileReader.onload = () => {
                            let fileURL = fileReader.result; //passing source of user file in fileURL variable

                            //adds the file and its characteristics to the list
                            acceptedFileListCard.innerHTML += `<li class="list-group-item mt-3 text-blue">
                                                                <div>
                                                                    <img class="me-4" src="${fileURL}" alt="image"/>
                                                                </div>
                                                            </li>`;
                        }
                        fileReader.readAsDataURL(file);
                    } else {
                        ckFiles = false;

                        unacceptedFileListCard.innerHTML += `<li class="list-group-item mt-3 text-red">
                                                                <i class="fad fa-file-times fa-2x text-dark-5"></i> ${file.name}
                                                            </li>`;
                    };
                };

                if (amount_of_files === 1 && ckFiles) msg.innerHTML = `<msg> ${amount_of_files} arquivo selecionado </msg>`;

                if (amount_of_files > 1 && ckFiles) msg.innerHTML = `<msg> ${amount_of_files} arquivos selecionados </msg>`;

                if (!ckFiles) msg.innerHTML = `<msg class="text-red"> Algum arquivo selecionado não é aceito </msg>`;

                //event clears file selection and upload details
                clearFormButton.addEventListener("click", () => {
                    clearUploadForm();
                });
            };
        };
    }
    applyMaskOnFileUploadInput();

    function clearUploadForm() {
        const
            fileInput = document.querySelector("#file-input"),
            acceptedFileListCard = document.querySelector("#upload-form-file-list #accepted-file-list-card"),
            unacceptedFileListCard = document.querySelector("#upload-form-file-list #unaccepted-file-list-card"),
            msg = document.querySelector("#upload-form-message"),
            btnGroup = document.querySelector("#upload-form-button-group");

        fileInput.value = "";
        acceptedFileListCard.innerHTML = "";
        acceptedFileListCard.style = "display:none";
        unacceptedFileListCard.innerHTML = "";
        unacceptedFileListCard.style = "display:none";
        btnGroup.style = "display:none";
        msg.innerHTML = `<i class="fas fa-times-circle fa-4x text-dark-5"></i> 
                        <msg class="text-dark-5">nenhuma imagem selecionada</msg>`;
        msg.classList.add("m-5");
    }

    function validarFormularioDeArquivos() {
        const
            btnSalvar = document.querySelector("#btn-salvar-form-upload"),
            inputFiles = document.querySelector("#file-input"),
            lista = document.querySelector("#upload-form-file-list #accepted-file-list-card"),
            msgArquivoInvalido = document.querySelector("#msg-aquivo-invalido-form-upload"),
            msgListaVazia = document.querySelector("#msg-lista-vazia-form-upload");

        if (!(btnSalvar == null)) {
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

                        if (tipoDoArquivo != acceptedFileList.formats.jpeg &&
                            tipoDoArquivo != acceptedFileList.formats.jpg) arquivoValido = false;

                        if (!arquivoValido) {
                            event.preventDefault();
                            msgArquivoInvalido.style = "display:block";
                        };
                    };

                    if (arquivoValido) {
                        asyncFileUpload();
                        clearUploadForm();
                    };
                };
            });
        };
    }
    validarFormularioDeArquivos();

    function asyncFileUpload() {
        const
            fileInput = document.querySelector("#file-input"),
            formData = new FormData();

        //browse selected files
        for (let file of fileInput.files) formData.append("files", file);

        // Send the file to the server using the fetch API
        fetch('/File/Upload', {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (response.ok) {
                    fetch('/File/_FileListPartial')
                        .then((response) => {
                            if (response.ok) return response.text();
                        })
                        .then((text) => {
                            document.querySelector('#container-tb-lista-arquivos-upload').innerHTML = text;
                        });
                } else {
                    // Handle the error if the upload was not successful
                    console.log('Upload failed: ' + response.status + ' ' + response.statusText);
                }
            })
            .catch(error => {
                // Handle any network errors
                console.log('Network error: ' + error);
            });
    }
    //#endregion

    //#region File List Table ------------------------
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
    //#endregion

    function reloadHtml() {
        const uploadNavLink = document.querySelector("#upload-nav-link");

        uploadNavLink.addEventListener("click", () => {

            //reloader the upload index
            fetch(`../../views/Upload/Index.html`)
                .then((response) => {
                    if (response.ok) return response.text();
                })
                .then((text) => {
                    const
                        startIndex = text.indexOf('<section id="upload-index">'),
                        endIndex = text.lastIndexOf('</section>'),
                        filteredText = text.substring(startIndex, endIndex); //filters a part of response.text()

                    document.querySelector('main').innerHTML = filteredText;

                    //reloader the functions
                    applyMaskOnFileUploadInput();
                    validarFormularioDeArquivos();
                });
        });
    }
    reloadHtml();
})();