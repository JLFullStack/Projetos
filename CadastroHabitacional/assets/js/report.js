const modelo = (dados) => {
    const [numeroDeProtocolo, nomeDoSolicitante, cpfDoSolicitante] = dados;

    const doc = new window.jspdf.jsPDF();

    doc.setFont("times", "bolditalic");
    doc.setFontSize(20);
    doc.text("Município da Estância Balneária de Praia Grande", 42, 22);
    doc.addImage("assets/img/brasao-monocromatico.png", "png", 15, 15, 18, 18);

    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.text("Estado de São Paulo", 95.5, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Protocolo de Cadastro de Demanda Habitacional", 105, 48, null, null, "center");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Nº.: ${numeroDeProtocolo}`, 105, 56, null, null, "center");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    const dataAtual = new Date().toLocaleDateString("pt-BR");

    const texto1 = `Na data de ${dataAtual}, o(a) Sr(a).: ${nomeDoSolicitante}, CPF: ${cpfDoSolicitante}, realizou cadastro na Secretaria de Habitação para Demanda Habitacional.`;
    const paragrafo1 = doc.splitTextToSize(texto1, 180);

    doc.text(16, 72, paragrafo1);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const texto2 = "Importante ressaltar que o cadastramento não garante a inclusão em programa habitacional por parte da SEHAB.";
    const paragrafo2 = doc.splitTextToSize(texto2, 180);

    doc.text(16, 98, paragrafo2, "justify");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    const texto3 = "A coleta e o tratamento dos dados são utilizados para a finalidade dos programas habitacionais e demais compartilhamentos, de acordo com a base legal que as fundamenta, dentre as permitidas pela legislação.";
    const paragrafo3 = doc.splitTextToSize(texto3, 180);

    doc.text(16, 124, paragrafo3);

    const tituloDoArquivo = `SEHAB_protocolo-${numeroDeProtocolo}_${dataAtual.replaceAll("/", "-")}`;

    doc.save(tituloDoArquivo);
}

const gerarComprovante = () => {
    const numeroDeProtocolo = 0;
    const nomeDoSolicitante = "João Ninguém";
    const cpfDoSolicitante = "768.106.830-97";

    modelo(
        [numeroDeProtocolo, nomeDoSolicitante, cpfDoSolicitante]
    );
}