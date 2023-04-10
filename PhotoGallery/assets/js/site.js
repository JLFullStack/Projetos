(function () {
    "use strict";

    function changeNavLinkActived() {
        const navLinks = document.querySelectorAll(".nav-link");

        //cycles through all navigation links in the application
        navLinks.forEach(navLink => {
            navLink.addEventListener("click", () => {
                const filteredNavLink = [...navLinks].filter(navLink => navLink.classList.contains("active"));

                filteredNavLink[0].classList.remove("active");
                navLink.classList.add("active");
            });
        });
    }
    changeNavLinkActived();
})();