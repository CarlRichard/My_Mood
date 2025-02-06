<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class SecurisationController extends AbstractController
{
    #[Route('/api/securisation', name: 'api_securisation', methods: ['GET'])]
    public function checkAuth(Security $security): JsonResponse
    {
        if (!$security->getUser()) {
            return new JsonResponse(['message' => 'Non authentifié'], 401);
        }
    
        return new JsonResponse(['message' => 'Authentifié']);
    }
    
}
