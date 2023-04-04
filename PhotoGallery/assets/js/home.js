(function () {
    "use strict";

    function reloadHtml() {
        const
            navLinks = document.querySelectorAll(".nav-link"),
            homeNavLinks = document.querySelectorAll(".home-nav-link");

        homeNavLinks.forEach(homeNavLink => {
            homeNavLink.addEventListener("click", () => {

                //active the navbar home
                navLinks.forEach(() => {
                    const
                        homeNavFiltered = [...homeNavLinks].filter(navLink => navLink.classList.contains("nav-link")),
                        navLinkFiltered = [...navLinks].filter(navLink => navLink.classList.contains("active"));

                    navLinkFiltered[0].classList.remove("active");
                    homeNavFiltered[0].classList.add("active");
                });

                //reloader the home index
                fetch(`../../views/Home/Index.html`)
                    .then((response) => {
                        if (response.ok) return response.text();
                    })
                    .then((text) => {
                        const
                            startIndex = text.indexOf('<section class="d-flex pt-3 pe-2 pb-3 ps-2" id="container-home">'),
                            endIndex = text.lastIndexOf('</section>'),
                            filteredText = text.substring(startIndex, endIndex);

                        document.querySelector('main').innerHTML = filteredText;
                    });
            });
        });
    }
    reloadHtml();
})();