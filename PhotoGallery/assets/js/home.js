(function () {
    "use strict";

    function reloadHtml() {
        const homeNavLinks = document.querySelectorAll(".home-nav-link");

        homeNavLinks.forEach(homeNavLink => {
            homeNavLink.addEventListener("click", () => {
                enableNavbar();
                
                //reloader the home page
                fetch(`../../views/Home/Index.html`)
                    .then((response) => {
                        if (response.ok) return response.text();
                    })
                    .then((text) => {
                        const
                            startIndex = text.indexOf('<section id="home-index">'),
                            endIndex = text.lastIndexOf('</section>'),
                            filteredText = text.substring(startIndex, endIndex); //filters a part of response.text()

                        document.querySelector('main').innerHTML = filteredText;
                    });
            });
        });

        function enableNavbar() {
            const navLinks = document.querySelectorAll(".nav-link");

            //active the navbar home
            navLinks.forEach(() => {
                const
                    filteredHomeNavLink = [...homeNavLinks].filter(navLink => navLink.classList.contains("nav-link")),
                    filteredNavLink = [...navLinks].filter(navLink => navLink.classList.contains("active"));

                filteredNavLink[0].classList.remove("active");
                filteredHomeNavLink[0].classList.add("active");
            });
        };
    }
    reloadHtml();
})();