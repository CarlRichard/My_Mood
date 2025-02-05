<?php
namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();

        if (!$user) {
            return;
        }

        // Récupérer les données actuelles du token
        $payload = $event->getData();

        // Ajouter le rôle de l'utilisateur au token
        $payload['role'] = $user->getRoles(); // getRoles() retourne un tableau, assure-toi que cela te convient

        // Ajouter l'ID de l'utilisateur au token
        $payload['id'] = $user->getId(); // Ajouter l'ID de l'utilisateur

        // Mettre à jour le payload du token
        $event->setData($payload);
    }
}
