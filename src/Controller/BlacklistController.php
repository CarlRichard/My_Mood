<?php
namespace App\Controller;

use App\Entity\Blacklist;
use App\Entity\Utilisateur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]
class BlacklistController extends AbstractController
{
    #[Route('/blacklist', name: 'blacklist_user', methods: ['POST'])]
    public function blacklistUser(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser(); // Superviseur qui fait l'action

        // Vérifie si l'utilisateur est un superviseur
        if (!in_array('ROLE_SUPERVISEUR', $user->getRoles())) {
            return new JsonResponse(['error' => 'Utilisateur non autorisé'], JsonResponse::HTTP_FORBIDDEN);
        }

        if (!isset($data['utilisateurId'])) {
            return new JsonResponse(['error' => 'ID de l\'utilisateur à bloquer requis'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Recherche de l'utilisateur à bloquer
        $utilisateurToBlacklist = $entityManager->getRepository(Utilisateur::class)->find($data['utilisateurId']);

        if (!$utilisateurToBlacklist) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Créer l'entrée de blacklist avec le superviseur
        $blacklist = new Blacklist();
        $blacklist->setUtilisateur($utilisateurToBlacklist);
        $blacklist->setSuperviseur($user); // Associe le superviseur actuel

        // Persister la blacklist
        $entityManager->persist($blacklist);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Utilisateur blacklisté avec succès'], JsonResponse::HTTP_CREATED);
    }
}
