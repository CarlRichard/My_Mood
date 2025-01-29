// Sélectionner les éléments nécessaires pour la gestion du formulaire
const formStagiaire = document.querySelector("#form_stagiaire");
const inputEmailStagiaire = document.querySelector(".input_email");
const inputPasswordStagiaire = document.querySelector(".input_password");
const divError = document.querySelector(".div_error_msg");
const main = document.querySelector("main");

// Ajouter un événement pour gérer la soumission du formulaire
formStagiaire.addEventListener("submit", (event) => {
  // Empêcher l'envoi par défaut du formulaire
  event.preventDefault();
  
  // Réinitialiser la section des erreurs avant de l'actualiser
  divError.innerHTML = "";
  
  // Initialiser les variables pour les messages d'erreur
  let errorMessageEmail = "";
  let errorMessageMp = "";

  // Vérifier si les champs email et mot de passe sont remplis
  if (!inputEmailStagiaire.value) {
    errorMessageEmail += "Veuillez entrer votre email !";
  }
  if (!inputPasswordStagiaire.value) {
    errorMessageMp += "Veuillez entrer votre mot de passe !";
  }

  // Si des erreurs existent, les afficher dans la section des erreurs
  if (errorMessageEmail) {
    const errorElement = document.createElement("p");
    errorElement.classList.add("message_error");
    errorElement.textContent = errorMessageEmail;
    divError.appendChild(errorElement);
  }
  if (errorMessageMp) {
    const errorElement2 = document.createElement("p");
    errorElement2.classList.add("message_error");
    errorElement2.textContent = errorMessageMp;
    divError.appendChild(errorElement2);
  }

  // Si des erreurs existent, empêcher l'envoi du formulaire
  if (errorMessageEmail || errorMessageMp) {
    main.appendChild(divError);
    return;
  } 

  // Créer l'objet avec les données du formulaire à envoyer
  const data = {
    email: inputEmailStagiaire.value,
    password: inputPasswordStagiaire.value,
  };
  console.log(data);

  // Envoyer les données du formulaire au serveur via fetch
  fetch("/api/login_check", {
    method: "POST",  // Spécifier que l'on envoie des données avec la méthode POST
    headers: {
      "Content-Type": "application/json",  // Définir le type de contenu à JSON
    },
    body: JSON.stringify(data),  // Convertir l'objet en JSON pour l'envoyer
  })
    .then((response) => response.json())  // Convertir la réponse en format JSON
    .then((result) => {
      console.log("Données envoyées avec succès :", result);
      try {
        // Vérifier si un token valide est renvoyé
        const token = result.token;

        if (!token || token.length < 2) {
          throw new Error("Token invalide");
        }

        // Si le token est valide, le stocker dans le localStorage
        localStorage.setItem("tokenUser", token);

        // Rediriger l'utilisateur vers une autre page s'il y a un token valide
        window.location.href = "../pages/stagiaires/mymood.html";
      } catch (error) {
        console.error("Erreur lors du traitement du token ou de la redirection :", error);
        // Afficher un message d'erreur si le token est invalide ou la redirection échoue
        const errorElement3 = document.createElement("p");
        errorElement3.classList.add('message_error');
        errorElement3.textContent = "Identifiant ou mot de passe incorrect.";
        divError.appendChild(errorElement3);
      }
    })
    .catch((error) => {
      // Gérer les erreurs de la requête fetch
      console.error("Erreur lors de l'envoi :", error);
    });
});
