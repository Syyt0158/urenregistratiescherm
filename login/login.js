const url = 'https://selinay.clockwise.info/api/v2/token';

const body = {
    "grant_type": "password",
    "client_id": "7vGTqbQzYI89sy0K"
};
let authResponse = null;

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
    const loadingMessage = document.getElementById("loading-message");

    // Verberg foutmelding en toon laadindicator
    errorMessage.style.display = "none";
    loadingMessage.style.display = "block";

    body.username = username;
    body.password = password;

    fetch(url, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
    })
    .then((resp) => {
        if (!resp.ok) {
            throw new Error("Ongeldige gebruikersnaam of wachtwoord");
        }
        return resp.json();
    })
    .then((resp) => {
        if (resp.access_token) {
            localStorage.setItem("token", resp.access_token);
            window.location.href = '/homepage/uren';
        } else {
            throw new Error("Ongeldige gebruikersnaam of wachtwoord");
        }
    })
    .catch((error) => {
        errorMessage.textContent = "Fout: ongeldige gebruikersnaam of wachtwoord!";
        errorMessage.style.display = "block";
    })
    .finally(() => {
        loadingMessage.style.display = "none"; // Verberg laadindicator
    });
}

// Voeg event listeners toe voor de Enter-toets
document.getElementById("username").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        login();
    }
});

document.getElementById("password").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        login();
    }
});
// /api/v2/hourregistration/projects/week/202507