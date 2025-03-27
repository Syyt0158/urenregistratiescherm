import './eventListeners.js';

document.getElementById("logout-button").addEventListener("click", function () {
    localStorage.clear(); // Verwijdert gebruikersgegevens
    sessionStorage.clear();
    window.location.href = "login.html"; // Doorverwijzen naar login
});

document.getElementById("dark-mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    // Pak het icoon element binnen de knop
    let icon = this.querySelector("i");

    // Check of dark mode actief is en pas het icoon aan
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "true"); // Dark mode opslaan
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        localStorage.setItem("darkMode", "false"); // Light mode opslaan
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
});

// Controleer of dark mode al actief was bij het laden van de pagina
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");

        // Zorg dat het icoon correct wordt weergegeven bij een refresh
        let icon = document.getElementById("dark-mode-toggle").querySelector("i");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }
});