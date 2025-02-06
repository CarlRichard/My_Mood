// Ajouter un écouteur d'événements sur le bouton de déconnexion
document
  .querySelector(".header_deconnexion")
  .addEventListener("click", function () {
    // Cacher le bouton de déconnexion lorsque l'utilisateur clique dessus
    document.querySelector(".header_deconnexion").style.display = "none";

    // Afficher l'alerte de déconnexion
    document.querySelector(".header_deconnexion_alert").style.display = "flex";
  });

// Ajouter un écouteur d'événements sur le bouton "Valider" de l'alerte de déconnexion
document
  .querySelector(".header_deconnexion_alert_valid:nth-of-type(1)")
  .addEventListener("click", function () {
    // Si l'utilisateur clique sur Valider
    localStorage.clear(); // Vider le localStorage pour déconnecter l'utilisateur
    window.location.href = "../../index.html"; // Rediriger l'utilisateur vers la page d'accueil
  });

// Ajouter un écouteur d'événements sur le bouton "Annuler" de l'alerte de déconnexion
document
  .querySelector(".header_deconnexion_alert_valid:nth-of-type(2)")
  .addEventListener("click", function () {
    // Si l'utilisateur clique sur Annuler
    document.querySelector(".header_deconnexion").style.display = "flex"; // Réafficher le bouton de déconnexion
    document.querySelector(".header_deconnexion_alert").style.display = "none"; // Cacher l'alerte de déconnexion
  });

// Fonction pour charger les utilisateurs dans le <select>
async function loadUtilisateurs() {
    const select = document.getElementById('utilisateur'); // Récupérer le <select> où les utilisateurs seront chargés

    try {
        // Faire une requête GET pour récupérer les utilisateurs depuis l'API
        const response = await fetch('/api/utilisateurs', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Ajouter le token d'authentification dans les en-têtes
            }
        });

        // Vérifier si la réponse est correcte
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des utilisateurs');
        }

        const utilisateurs = await response.json(); // Convertir la réponse en JSON

        // Vider le <select> avant de le remplir avec les utilisateurs
        select.innerHTML = '<option value="">Sélectionner un utilisateur</option>';

        // Ajouter chaque utilisateur comme une option dans le <select>
        utilisateurs.forEach(utilisateur => {
            const option = document.createElement('option');
            option.value = utilisateur.id; // Définir l'id de l'utilisateur comme valeur
            option.textContent = `${utilisateur.nom} ${utilisateur.prenom}`; // Afficher le nom et prénom de l'utilisateur
            select.appendChild(option); // Ajouter l'option dans le <select>
        });

        // Ajouter un événement pour charger les données de l'utilisateur sélectionné
        select.addEventListener('change', loadUtilisateurData);
    } catch (error) {
        // En cas d'erreur, l'afficher dans la console
        console.error('Erreur:', error);
    }
}

// Fonction pour charger les données d'un utilisateur sélectionné dans le formulaire
async function loadUtilisateurData() {
    const id = document.getElementById('utilisateur').value; // Récupérer l'id de l'utilisateur sélectionné

    // Si un utilisateur a été sélectionné
    if (id) {
        try {
            // Faire une requête GET pour récupérer les données de l'utilisateur par son id
            const response = await fetch(`/api/utilisateurs/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token') // Ajouter le token d'authentification dans les en-têtes
                }
            });

            // Vérifier si la réponse est correcte
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données utilisateur');
            }

            const utilisateur = await response.json(); // Convertir la réponse en JSON

            // Remplir les champs du formulaire avec les données de l'utilisateur
            document.getElementById('id').value = utilisateur.id;
            document.getElementById('nom').value = utilisateur.nom;
            document.getElementById('prenom').value = utilisateur.prenom;
            document.getElementById('email').value = utilisateur.email;
            document.getElementById('role').value = utilisateur.roles[0] || 'ROLE_ETUDIANT'; // Mettre à jour le rôle de l'utilisateur
        } catch (error) {
            // En cas d'erreur, l'afficher dans la console
            console.error('Erreur:', error);
        }
    }
}

// Ajouter un écouteur d'événements pour la soumission du formulaire de mise à jour
document.getElementById('updateForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Empêcher la soumission par défaut du formulaire

    // Récupérer les valeurs des champs du formulaire
    const id = document.getElementById('id').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        // Faire une requête PUT pour mettre à jour les informations de l'utilisateur
        const response = await fetch(`/api/utilisateurs/${id}`, {
            method: 'PUT', // Méthode PUT pour mettre à jour
            headers: {
                'Content-Type': 'application/json', // Spécifier que les données envoyées sont en JSON
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Ajouter le token d'authentification dans les en-têtes
            },
            body: JSON.stringify({ // Convertir les données du formulaire en JSON
                nom,
                prenom,
                email,
                password,
                roles: [role] // Envoyer le rôle de l'utilisateur
            })
        });

        // Vérifier si la réponse est correcte
        if (response.ok) {
            alert('Utilisateur mis à jour avec succès'); // Afficher un message de succès
        } else {
            throw new Error('Erreur lors de la mise à jour de l\'utilisateur'); // Lancer une erreur si la mise à jour échoue
        }
    } catch (error) {
        // Afficher l'erreur dans une alerte
        alert(error.message);
    }
});

// Charger les utilisateurs au chargement de la page
window.onload = loadUtilisateurs; // Appeler la fonction loadUtilisateurs lorsque la page est chargée
