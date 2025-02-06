//verifier le token et sa validitée

const token = localStorage.getItem("token");

if (!token) { // si token manquant
    window.location.href = "/index.html";
} else {
    fetch("/api/securisation", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        if (response.status === 401) { // expiré
            localStorage.removeItem("token"); 
            window.location.href = "./index.html"; 
        }
    })
    .catch(error => console.error("Erreur de vérification du token:", error));
}
