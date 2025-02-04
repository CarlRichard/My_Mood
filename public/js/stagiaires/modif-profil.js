
const token = localStorage.getItem("token");
let userData = null; // Variable globale pour stocker les données de l'utilisateur

function getUsernameFromToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decodedToken = JSON.parse(jsonPayload);
    return decodedToken.username;
}

if (token) {
    const username = getUsernameFromToken(token); // Extraire le nom d'utilisateur du token JWT

    // Récupérer les données de l'utilisateur
    fetch(`/api/utilisateurs/username/${username}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                userData = data; // Stocker les données utilisateur dans une variable globale
                // Remplir le formulaire avec les données existantes de l'utilisateur
                document.querySelector('input[placeholder="Nom"]').value = data.nom;
                document.querySelector('input[placeholder="Prenom"]').value = data.prenom;
                document.querySelector('input[placeholder="Adresse mail"]').value = data.email;
            } else {
                console.error('Utilisateur non trouvé ou accès interdit');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données utilisateur:', error);
        });

    // Gestion du formulaire pour mettre à jour les informations
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Empêcher l'envoi classique du formulaire

        if (!userData) {
            console.error("Les données utilisateur n'ont pas été récupérées.");
            return;
        }

        // Récupérer les nouvelles données
        const updatedNom = document.querySelector('input[placeholder="Nom"]').value;
        const updatedPrenom = document.querySelector('input[placeholder="Prenom"]').value;
        const updatedEmail = document.querySelector('input[placeholder="Adresse mail"]').value;
        const updatedPassword = document.querySelector('input[placeholder="Nouveau mot de passe"]').value;

        // Préparer les données à envoyer avec le PATCH
        const updatedData = {
            nom: updatedNom,
            prenom: updatedPrenom,
            email: updatedEmail,
            password: updatedPassword // Si le mot de passe est modifié
        };

        // Identifier l'utilisateur avec son ID, ici récupéré à partir de `userData.id`
        const userId = userData.id;

        // Envoi du PATCH pour mettre à jour l'utilisateur
        fetch(`/api/utilisateurs/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/merge-patch+json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    console.log('Utilisateur mis à jour avec succès', data);
                    // Vous pouvez aussi rediriger ou afficher un message de succès
                    alert("Votre profil a été mis à jour avec succès.");
                } else {
                    console.error('Échec de la mise à jour de l\'utilisateur');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour des données utilisateur:', error);
            });
    });
}
