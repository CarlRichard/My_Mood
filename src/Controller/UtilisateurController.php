<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\CohorteRepository;
use App\Service\MailerService;
use App\Service\PasswordGenerator;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
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
        if (!isset($data['email'], $data['nom'], $data['prenom'])) {
            return new JsonResponse(['message' => 'Email, nom et prénom requis'], 400);
        }

        // Mise à jour des données
        $utilisateur->setEmail($data['email']);
        $utilisateur->setNom($data['nom']);
        $utilisateur->setPrenom($data['prenom']);

        // Si un mot de passe est fourni, le hacher et le mettre à jour
        if (isset($data['password']) && !empty($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($utilisateur, $data['password']);
            $utilisateur->setPassword($hashedPassword);
        }

        // Mise à jour du rôle, s'il est spécifié, sinon on garde le rôle actuel
        if (isset($data['role']) && in_array($data['role'], ['ROLE_ETUDIANT', 'ROLE_SUPERVISEUR', 'ROLE_ADMIN'])) {
            $utilisateur->setRoles([$data['role']]);
        }

        // Sauvegarde en base
        $entityManager->persist($utilisateur);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur mis à jour avec succès'], 200);
    }

    /**
     * Créer un utilisateur et envoyer le mot de passe par email
     */
    #[Route('/mail', name: 'mail_user', methods: ['POST'])]
    public function createUserMail(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, MailerService $mailerService, CohorteRepository $cohorteRepository)
    {
        $data = json_decode($request->getContent(), true);

        // Vérification des champs requis
        if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new BadRequestHttpException('Email requis ou format invalide');
        }

        if (!isset($data['nom']) || !isset($data['prenom'])) {
            throw new BadRequestHttpException('Nom et prénom requis');
        }

        $user = new Utilisateur();
        $user->setEmail($data['email']);
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);

        // Définir le rôle par défaut (ROLE_ETUDIANT) si non fourni
        $role = $data['role'] ?? 'ROLE_ETUDIANT';
        if (!in_array($role, ['ROLE_ETUDIANT', 'ROLE_SUPERVISEUR', 'ROLE_ADMIN'])) {
            return new JsonResponse(['message' => 'Rôle invalide : choisissez ROLE_ETUDIANT, ROLE_SUPERVISEUR ou ROLE_ADMIN'], 400);
        }
        $user->setRoles([$role]);

        // Générer un mot de passe temporaire
        $plainPassword = bin2hex(random_bytes(4)); // Un mot de passe temporaire de 8 caractères
        $hashedPassword = $passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);
        if (isset($data['groupes'])) {
            foreach ($data['groupes'] as $cohorteId) {
                $cohorte = $cohorteRepository->find($cohorteId);
                if ($cohorte) {
                    $user->addGroupe($cohorte);
                } else {
                    return new JsonResponse(['message' => 'Cohorte non trouvée'], 404);
                }
            }
        }
        

        // Essayer d'envoyer l'email
        try {
            // Envoyer l'email avec les informations de compte
            $mailerService->sendAccountCreationEmail($user->getEmail(), $plainPassword);

            // Si l'email est envoyé avec succès, persister l'utilisateur en base de données
            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse(['message' => 'Utilisateur créé avec succès, email envoyé.']);
        } catch (\Exception $e) {
            // Si l'envoi échoue, renvoyer une erreur
            return new JsonResponse(['message' => 'Erreur lors de l\'envoi de l\'email: ' . $e->getMessage()], 500);
        }
    }
}
