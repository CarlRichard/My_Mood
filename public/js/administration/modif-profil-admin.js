// je selection mes éléments nécessaires
const okButton = document.querySelector(".modif_button");
const adminButton = document.querySelector(".admin-btn");
const logoutButton = document.querySelector(".logout-btn");

// je crée un évenement au click qui me redirige vers une autre page
okButton.addEventListener("click", function () {
  window.location.href = "../../pages/stagiaires/mymood.html";
});

adminButton.addEventListener("click", function () {
  window.location.href = "";
});

logoutButton.addEventListener("click", function () {
  // Envoi de la requête POST à l'API Symfony pour la déconnexion
  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Déconnexion réussie") {
        // Effacer le token dans localStorage
        localStorage.removeItem("token");
        // Rediriger vers la page de connexion
        window.location.href = "../../index.html";
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la déconnexion:", error);
    });
});
