<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Service\PasswordGenerator;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class UtilisateurController extends AbstractController
{
    /**
     * Créer un nouvel utilisateur (avec mot de passe fourni par l'admin)
     */
    #[Route('/utilisateur', name: 'create_user', methods: ['POST'])]
    public function createUser(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Vérification des champs requis
        if (!isset($data['email'], $data['password'], $data['nom'], $data['prenom'])) {
            return new JsonResponse(['message' => 'Email, mot de passe, nom et prénom requis'], 400);
        }

        // Définir le rôle (par défaut : ROLE_ETUDIANT)
        $role = $data['role'] ?? 'ROLE_ETUDIANT';
        if (!in_array($role, ['ROLE_ETUDIANT', 'ROLE_SUPERVISEUR', 'ROLE_ADMIN'])) {
            return new JsonResponse(['message' => 'Rôle invalide : choisissez ROLE_ETUDIANT, ROLE_SUPERVISEUR ou ROLE_ADMIN'], 400);
        }

        // Création de l'utilisateur
        $utilisateur = new Utilisateur();
        $utilisateur->setEmail($data['email']);
        $utilisateur->setNom($data['nom']);
        $utilisateur->setPrenom($data['prenom']);
        $hashedPassword = $passwordHasher->hashPassword($utilisateur, $data['password']);
        $utilisateur->setPassword($hashedPassword);
        $utilisateur->setRoles([$role]);

        // Persistance en base
        $entityManager->persist($utilisateur);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur créé avec succès'], 201);
    }

    /**
     * Mettre à jour un utilisateur existant
     */
    #[Route('/utilisateur/{id}', name: 'update_user', methods: ['PUT'])]
    public function updateUser(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Recherche de l'utilisateur
        $utilisateur = $entityManager->getRepository(Utilisateur::class)->find($id);
        if (!$utilisateur) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Vérification des champs requis
        if (!isset($data['email'], $data['password'], $data['nom'], $data['prenom'])) {
            return new JsonResponse(['message' => 'Email, mot de passe, nom et prénom requis'], 400);
        }

        // Mise à jour des données
        $role = $data['role'] ?? $utilisateur->getRoles()[0];
        if (!in_array($role, ['ROLE_ETUDIANT', 'ROLE_SUPERVISEUR', 'ROLE_ADMIN'])) {
            return new JsonResponse(['message' => 'Rôle invalide : choisissez ROLE_ETUDIANT, ROLE_SUPERVISEUR ou ROLE_ADMIN'], 400);
        }

        $utilisateur->setEmail($data['email']);
        $utilisateur->setNom($data['nom']);
        $utilisateur->setPrenom($data['prenom']);
        $hashedPassword = $passwordHasher->hashPassword($utilisateur, $data['password']);
        $utilisateur->setPassword($hashedPassword);
        $utilisateur->setRoles([$role]);

        // Sauvegarde en base
        $entityManager->persist($utilisateur);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur mis à jour avec succès'], 200);
    }

    /**
     * Créer un utilisateur et envoyer le mot de passe par email
     */
    #[Route('/mail', name: 'create_user_mail', methods: ['POST'])]
    public function mailUser(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        PasswordGenerator $passwordGenerator,
        EmailService $emailService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Vérification des champs requis
        if (!isset($data['email'], $data['nom'], $data['prenom'])) {
            return new JsonResponse(['message' => 'Email, nom et prénom requis'], 400);
        }

        // Définir le rôle (par défaut : ROLE_ETUDIANT)
        $role = $data['role'] ?? 'ROLE_ETUDIANT';
        if (!in_array($role, ['ROLE_ETUDIANT', 'ROLE_SUPERVISEUR', 'ROLE_ADMIN'])) {
            return new JsonResponse(['message' => 'Rôle invalide : choisissez ROLE_ETUDIANT, ROLE_SUPERVISEUR ou ROLE_ADMIN'], 400);
        }

        // Création de l'utilisateur
        $utilisateur = new Utilisateur();
        $utilisateur->setEmail($data['email']);
        $utilisateur->setNom($data['nom']);
        $utilisateur->setPrenom($data['prenom']);

        // Génération et hachage du mot de passe aléatoire
        $plainPassword = $passwordGenerator->generatePassword();
        $hashedPassword = $passwordHasher->hashPassword($utilisateur, $plainPassword);
        $utilisateur->setPassword($hashedPassword);
        $utilisateur->setRoles([$role]);

        // Persistance en base
        $entityManager->persist($utilisateur);
        $entityManager->flush();

        // Envoi du mot de passe par email
        $emailService->sendNewAccountEmail($utilisateur->getEmail(), $utilisateur->getNom(), $plainPassword);

        return new JsonResponse(['message' => 'Utilisateur créé avec succès et mot de passe envoyé par email'], 201);
    }
}
