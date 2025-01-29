<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Cohorte;

class CohorteFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $noms = ['Formation Développeur Web', 'Formation Data Analyst', 'Formation Cybersécurité'];

        foreach ($noms as $nom) {
            $cohorte = new Cohorte();
            $cohorte->setNom($nom);
            $manager->persist($cohorte);
        }

        $manager->flush();
    }
}
