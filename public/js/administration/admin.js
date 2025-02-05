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
    document.querySelector(".header_deconnexion").style.display = "flex";
    document.querySelector(".header_deconnexion_alert").style.display = "none";
  });


// Fonction pour charger les utilisateurs dans le <select>
async function loadUtilisateurs() {
    const select = document.getElementById('utilisateur');

    try {
        const response = await fetch('/api/utilisateurs', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des utilisateurs');
        }

        const utilisateurs = await response.json();

        // Vider le select avant de le remplir
        select.innerHTML = '<option value="">Sélectionner un utilisateur</option>';

        // Ajouter chaque utilisateur dans le <select>
        utilisateurs.forEach(utilisateur => {
            const option = document.createElement('option');
            option.value = utilisateur.id;
            option.textContent = `${utilisateur.nom} ${utilisateur.prenom}`;
            select.appendChild(option);
        });

        // Ajouter un événement pour charger les données au changement de sélection
        select.addEventListener('change', loadUtilisateurData);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour charger les données d'un utilisateur sélectionné dans le formulaire
async function loadUtilisateurData() {
    const id = document.getElementById('utilisateur').value;

    if (id) {
        try {
            const response = await fetch(`/api/utilisateurs/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données utilisateur');
            }

            const utilisateur = await response.json();

            // Remplir les champs du formulaire avec les données de l'utilisateur
            document.getElementById('id').value = utilisateur.id;
            document.getElementById('nom').value = utilisateur.nom;
            document.getElementById('prenom').value = utilisateur.prenom;
            document.getElementById('email').value = utilisateur.email;
            document.getElementById('role').value = utilisateur.roles[0] || 'ROLE_ETUDIANT';
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
}

// Soumettre le formulaire pour mettre à jour l'utilisateur
document.getElementById('updateForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('id').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch(`/api/utilisateurs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                nom,
                prenom,
                email,
                password,
                roles: [role]
            })
        });

        if (response.ok) {
            alert('Utilisateur mis à jour avec succès');
        } else {
            throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
        }
    } catch (error) {
        alert(error.message);
    }
});

// Charger les utilisateurs au chargement de la page
window.onload = loadUtilisateurs;
