// Écouter l'événement de clic sur le lien SOS pour envoyer une alerte
const moodLinkSos = document.querySelector(".confirm_alert_validate_button");

moodLinkSos.addEventListener("click", () => {
  let tokenUser = localStorage.getItem("token"); // Récupérer le token de l'utilisateur depuis le localStorage

  // Vérifier si le token existe dans le localStorage avant d'envoyer la requête
  if (tokenUser) {
    console.log("Token récupéré :", tokenUser);

    // Configurer et envoyer la requête POST pour générer une alerte
    fetch("/api/alertes", {
      method: "POST", // Définir la méthode de la requête HTTP (POST)
      headers: {
        "Content-Type": "application/json", // Spécifier que les données envoyées sont au format JSON
        Authorization: `Bearer ${tokenUser}`, // Ajouter le token dans l'en-tête pour authentification
      },
      body: JSON.stringify({
        statut: "EN_COURS", // ID utilisateur (peut être remplacé selon l'implémentation)
      }),
    })
      .then((response) => response.json()) // Traiter la réponse du serveur au format JSON
      .then((data) => {
        console.log("Réponse du serveur :", data); // Afficher les données de la réponse

        // Rediriger vers la page ./mymood.html après l'envoi de la requête
        window.location.href = './mymood.html';
      })
      .catch((error) => {
        console.error("Erreur de la requête fetch :", error); // Gérer les erreurs liées à la requête fetch
      });
  } else {
    console.log("Aucun token trouvé dans le localStorage"); // Message si le token n'est pas trouvé
  }
});
