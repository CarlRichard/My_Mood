<?php

namespace App\DataFixtures;

use App\Entity\Utilisateur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UtilisateurFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        $roles = ['ROLE_ETUDIANT', 'ROLE_SUPERVISEUR', 'ROLE_ADMIN'];

        for ($i = 0; $i < 10; $i++) {
            $utilisateur = new Utilisateur();
            $utilisateur->setEmail($faker->unique()->email);
            $utilisateur->setNom($faker->lastName);
            $utilisateur->setPrenom($faker->firstName);
            
            // Mot de passe par défaut : "password"
            $hashedPassword = $this->passwordHasher->hashPassword($utilisateur, 'password');
            $utilisateur->setPassword($hashedPassword);

            // Rôle aléatoire
            $utilisateur->setRoles([$faker->randomElement($roles)]);

            $manager->persist($utilisateur);
        }

        $manager->flush();
    }
}
