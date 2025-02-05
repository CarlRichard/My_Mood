<?php
namespace App\Controller;

use App\Entity\Alerte;
use App\Entity\Historique;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class AlerteController extends AbstractController
{
    #[Route('/api/alertes', name: 'create_sos', methods: ['POST'])]
    public function createSOS(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();  // Récupérer l'utilisateur authentifié

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Crée l'alerte
        $alerte = new Alerte();
        $alerte->setStatut('EN_COURS'); // Statut initial
        $alerte->setUtilisateur($user); // Associe l'utilisateur authentifié à l'alerte
        $alerte->setDateCreation(new \DateTime());

        // Persiste l'alerte dans la base de données
        $entityManager->persist($alerte);
        $entityManager->flush();


        return new JsonResponse(['status' => 'Alerte créés'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/api/alertes/{id}/statut', name: 'update_alerte_statut_patch', methods: ['PATCH'])]
    #[IsGranted('ROLE_SUPERVISEUR')]  // Seuls les superviseurs peuvent modifier le statut
    public function patchStatut(Alerte $alerte, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Décoder le contenu de la requête
        $data = json_decode($request->getContent(), true);

        // Vérification si le champ "statut" est présent dans la requête
        if (!isset($data['statut'])) {
            return new JsonResponse(['error' => 'Le champ "statut" est obligatoire'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $nouveauStatut = $data['statut'];

        // Vérification de la validité du statut
        if (!in_array($nouveauStatut, ['EN_COURS', 'RESOLUE', 'ANNULEE'])) {
            return new JsonResponse(['error' => 'Statut invalide'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Mettre à jour le statut de l'alerte
        $alerte->setStatut($nouveauStatut);

        // Laisser la date_creation inchangée (pas de modification de la date)
        $entityManager->flush();

        return new JsonResponse(['message' => 'Statut mis à jour avec succès'], JsonResponse::HTTP_OK);
    }
}
    


