<?php

namespace App\EventListener;

use App\Entity\Alerte;
use App\Entity\Historique;
use Doctrine\ORM\EntityManagerInterface;

class AlerteCreationListener
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function postPersist(Alerte $alerte): void
    {
        // Créer un nouvel historique
        $historique = new Historique();
        $historique->setAlerte($alerte);
        $historique->setAction('Création de l\'alerte');
        $historique->setDateAction(new \DateTime());

        // Persister et sauvegarder l'historique
        $this->entityManager->persist($historique);
        $this->entityManager->flush();
    }
}