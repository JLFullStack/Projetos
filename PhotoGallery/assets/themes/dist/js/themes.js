(function () {
    "use strict";

    const 
        body = document.body,
        dark_theme = document.querySelectorAll(".dark"),
        ico_theme = document.querySelector(".ico-theme");

    const setdarkmode = () => {
        body.classList.add("dark");
        body.classList.remove("light");
        dark_theme.forEach(tag => tag.classList.add("dark"));
        dark_theme.forEach(tag => tag.classList.remove("light"));
    }

    const setlightmode = () => {
        body.classList.add("light");
        body.classList.remove("dark");
        dark_theme.forEach(tag => tag.classList.add("light"));
        dark_theme.forEach(tag => tag.classList.remove("dark"));
    }

    ico_theme.addEventListener("click", () => {
        if (body.classList.contains("dark")) setlightmode();
        else setdarkmode();
    });
})();