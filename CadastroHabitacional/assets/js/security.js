(() => {
    const elementos = document.querySelectorAll(".etapa-title, .etapa-content");

    const reiniciarAplicacao = (elemento) => {
        if (elemento[0].target.style.display === "") location.reload();
    }

    const observer = new MutationObserver(reiniciarAplicacao);

    for (const elemento of elementos) {
        observer.observe(elemento, {
            attributes: true,
        });
    }
})();