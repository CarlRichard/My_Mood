<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class ApiLoginController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof UserInterface) {
            return new JsonResponse(['error' => 'Invalid user'], 401);
        }

        return new JsonResponse([
            'message' => 'Login successful',
            'user' => $user->getUserIdentifier(), // Utilisez getUserIdentifier() pour récupérer l'identifiant
        ]);
    }
}
