(function () {
    "use strict";

    function changeNavLinkActived() {
        const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(navLink => {
            navLink.addEventListener("click", () => {
                const navLinkFiltered = [...navLinks].filter(navLink => navLink.classList.contains("active"));

                navLinkFiltered[0].classList.remove("active");
                navLink.classList.add("active");
            });
        });
    }
    changeNavLinkActived();
})();