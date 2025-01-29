<?php 
namespace App\Controller;

use App\Repository\CohorteRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CohorteUtilisateurController extends AbstractController
{
    private $cohorteRepository;

    public function __construct(CohorteRepository $cohorteRepository)
    {
        $this->cohorteRepository = $cohorteRepository;
    }

    /**
     * @Route("/api/cohortes/{id}/utilisateurs", name="cohorte_utilisateurs", methods={"GET"})
     */
    public function getUtilisateursByCohorte(int $id): JsonResponse
    {
        $cohorte = $this->cohorteRepository->find($id);

        if (!$cohorte) {
            return new JsonResponse(['message' => 'Cohorte not found'], 404);
        }

        $utilisateurs = $cohorte->getUtilisateurs();
        $data = [];

        foreach ($utilisateurs as $utilisateur) {
            $data[] = [
                'id' => $utilisateur->getId(),
                'email' => $utilisateur->getEmail(),
                'nom' => $utilisateur->getNom(),
                'prenom' => $utilisateur->getPrenom(),
            ];
        }

        return new JsonResponse($data);
    }
}
