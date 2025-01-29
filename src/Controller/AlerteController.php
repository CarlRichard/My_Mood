<?php
namespace App\Controller;

use App\Entity\Alerte;
use App\Entity\Historique;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

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
}
