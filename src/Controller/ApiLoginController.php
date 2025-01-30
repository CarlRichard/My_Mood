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

        // Vérifier si l'utilisateur est authentifié
        if (!$user instanceof UserInterface) {
            return new JsonResponse(['error' => 'Invalid user'], 401);
        }

        // Récupérer les rôles de l'utilisateur
        $roles = $user->getRoles();  // Cela renvoie un tableau des rôles (par exemple ['ROLE_USER', 'ROLE_ADMIN'])

        // Si vous souhaitez renvoyer un seul rôle ou la liste complète, vous pouvez adapter cela
        $role = $roles[0];  // Vous pouvez récupérer le premier rôle de la liste

        return new JsonResponse([
            'message' => 'Login successful',
            'user' => $user->getUserIdentifier(), // Utilisez getUserIdentifier() pour récupérer l'identifiant
            'role' => $role,  // Renvoyer le rôle de l'utilisateur
        ]);
    }
}
