<?php

namespace App\DataFixtures;

use App\Entity\Utilisateur;
use App\Entity\Cohorte;
use App\Entity\Alerte;
use App\Entity\Historique;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class DonneesData extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Création de cohortes
        $cohorteA = new Cohorte();
        $cohorteA->setNom('Front-end');
        $manager->persist($cohorteA);

        $cohorteB = new Cohorte();
        $cohorteB->setNom('Back-end');
        $manager->persist($cohorteB);

        $cohorteC = new Cohorte();
        $cohorteC->setNom('CDA');
        $manager->persist($cohorteC);

        // Utilisation de Faker pour générer des données simulées
        $faker = Factory::create();

        // Création d'utilisateurs avec Faker
        $user1 = new Utilisateur();
        $user1->setEmail('etudiant@test.com');
        $user1->setNom($faker->lastName);
        $user1->setPrenom($faker->firstName);
        $user1->setRoles(['ROLE_ETUDIANT']);
        $user1->setPassword(password_hash('password', PASSWORD_BCRYPT));
        $manager->persist($user1);

        $user2 = new Utilisateur();
        $user2->setEmail('superviseur@test.com');
        $user2->setNom('Smith');
        $user2->setPrenom('Jane');
        $user2->setRoles(['ROLE_SUPERVISEUR']);
        $user2->setPassword(password_hash('password', PASSWORD_BCRYPT));
        $manager->persist($user2);

        $user3 = new Utilisateur();
        $user3->setEmail('admin@test.com');
        $user3->setNom('Brown');
        $user3->setPrenom('Mike');
        $user3->setRoles(['ROLE_ADMIN']);
        $user3->setPassword(password_hash('password', PASSWORD_BCRYPT));
        $manager->persist($user3);

        $user4 = new Utilisateur();
        $user4->setEmail('Mike.dat@test.com');
        $user4->setNom('Dat');
        $user4->setPrenom('Mike');
        $user4->setRoles(['ROLE_ETUDIANT']);
        $user4->setPassword(password_hash('password', PASSWORD_BCRYPT));
        $manager->persist($user4);


        $user5 = new Utilisateur();
        $user5->setEmail('k.Wilson@test.com');
        $user5->setNom('Wilson');
        $user5->setPrenom('Kelly');
        $user5->setRoles(['ROLE_ADMIN']);
        $user5->setPassword(password_hash('password', PASSWORD_BCRYPT));
        $manager->persist($user5);

        // Création de quelques autres utilisateurs
        for ($i = 0; $i < 10; $i++) {
            $user = new Utilisateur();
            $user->setEmail($faker->email);
            $user->setNom($faker->lastName);
            $user->setPrenom($faker->firstName);
            $user->setRoles(['ROLE_ETUDIANT']);
            $user->setPassword(password_hash('password', PASSWORD_BCRYPT));
            $manager->persist($user);
        }

        // Associer les utilisateurs à différentes cohortes
        $user1->addGroupe($cohorteA);
        $user2->addGroupe($cohorteA);
        $user3->addGroupe($cohorteB);
        $user4->addGroupe($cohorteA);
        $user5->addGroupe($cohorteA);


        // Créer des historiques pour les utilisateurs
        $historique1 = new Historique();
        $historique1->setHumeur($faker->numberBetween(1, 100)); // Score d'humeur aléatoire entre 1 et 100
        $historique1->setDateCreation($faker->dateTimeThisYear);
        $historique1->setUtilisateur($user1);
        $manager->persist($historique1);

        $historique2 = new Historique();
        $historique2->setHumeur($faker->numberBetween(1, 10));
        $historique2->setDateCreation($faker->dateTimeThisYear);
        $historique2->setUtilisateur($user2);
        $manager->persist($historique2);

        $historique3 = new Historique();
        $historique3->setHumeur($faker->numberBetween(1, 10));
        $historique3->setDateCreation($faker->dateTimeThisYear);
        $historique3->setUtilisateur($user3);
        $manager->persist($historique3);

        $historique4 = new Historique();
        $historique4->setHumeur($faker->numberBetween(1, 10));
        $historique4->setDateCreation($faker->dateTimeThisYear);
        $historique4->setUtilisateur($user4);
        $manager->persist($historique4);

        $historique5 = new Historique();
        $historique5->setHumeur($faker->numberBetween(1, 10));
        $historique5->setDateCreation($faker->dateTimeThisYear);
        $historique5->setUtilisateur($user5);
        $manager->persist($historique5);
        // Créer des alertes pour certains utilisateurs
        $alerte1 = new Alerte();
        $alerte1->setStatut('EN_COURS');
        $alerte1->setUtilisateur($user1);
        $alerte1->setDateCreation($faker->dateTimeThisYear);
        $manager->persist($alerte1);

        $alerte2 = new Alerte();
        $alerte2->setStatut('EN_COURS');
        $alerte2->setUtilisateur($user2);
        $alerte2->setDateCreation($faker->dateTimeThisYear);
        $manager->persist($alerte2);

        // Sauvegarder en base de données
        $manager->flush();
    }
}
