document
  .querySelector(".header_deconnexion")
  .addEventListener("click", function () {
    // Cacher le bouton de déconnexion
    document.querySelector(".header_deconnexion").style.display = "none";

    // Afficher l'alerte de déconnexion
    document.querySelector(".header_deconnexion_alert").style.display = "flex";
  });

document
  .querySelector(".header_deconnexion_alert_valid:nth-of-type(1)")
  .addEventListener("click", function () {
    // Si l'utilisateur clique sur Valider
    localStorage.clear(); // Vider le localStorage
    window.location.href = "../../index.html"; // Rediriger vers index.html
  });

document
  .querySelector(".header_deconnexion_alert_valid:nth-of-type(2)")
  .addEventListener("click", function () {
    // Si l'utilisateur clique sur Annuler
    // Réafficher le bouton de déconnexion
    document.querySelector(".header_deconnexion").style.display = "flex";

    // Cacher l'alerte de déconnexion
    document.querySelector(".header_deconnexion_alert").style.display = "none";
  });



// Fonction pour charger les données d'un utilisateur sélectionné dans le formulaire
async function loadUtilisateurData() {
    const id = document.getElementById('utilisateur').value; // Récupère l'ID de l'utilisateur sélectionné

    if (id) {
        // Envoie une requête GET pour récupérer les détails de l'utilisateur avec l'ID spécifié
        const response = await fetch(`/api/utilisateurs/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Ajoute le token d'authentification
            }
        });

        // Si la réponse est correcte (code 200), on traite les données reçues
        if (response.ok) {
            const utilisateur = await response.json(); // Parse la réponse JSON et la stocke dans la variable 'utilisateur'

            // Remplir les champs du formulaire avec les données de l'utilisateur
            document.getElementById('id').value = utilisateur.id;
            document.getElementById('nom').value = utilisateur.nom;
            document.getElementById('prenom').value = utilisateur.prenom;
            document.getElementById('email').value = utilisateur.email;
            document.getElementById('role').value = utilisateur.roles[0]; // Assumer qu'il y a un seul rôle pour l'utilisateur
        }
    }
}

// Soumettre le formulaire pour mettre à jour l'utilisateur
document.getElementById('updateForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Empêche la soumission du formulaire de recharger la page

    // Récupère les valeurs des champs du formulaire
    const id = document.getElementById('id').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Envoie une requête PUT pour mettre à jour les informations de l'utilisateur
    const response = await fetch(`/api/utilisateurs/${id}`, {
        method: 'PUT', // Méthode PUT pour la mise à jour
        headers: {
            'Content-Type': 'application/json', // En-tête pour indiquer que le corps est en JSON
            'Authorization': 'Bearer ' + localStorage.getItem('token') // Ajoute le token d'authentification
        },
        body: JSON.stringify({
            nom: nom,
            prenom: prenom,
            email: email,
            password: password,
            roles: [role] // On envoie les rôles sous forme de tableau, même s'il n'y en a qu'un
        })
    });

    // Vérifie la réponse de la requête
    if (response.ok) {
        alert('Utilisateur mis à jour avec succès'); // Affiche un message de succès
    } else {
        alert('Erreur lors de la mise à jour de l\'utilisateur'); // Affiche un message d'erreur
    }
});

// Charger les utilisateurs lors du chargement de la page
window.onload = loadUtilisateurs; // Appelle la fonction pour charger les utilisateurs dès que la page est prête
