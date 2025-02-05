<?php
namespace App\Entity;

use App\Repository\AlerteRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

// Alerte.php

#[ORM\Entity(repositoryClass: AlerteRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['alerte:read']],
    denormalizationContext: ['groups' => ['alerte:write', 'alerte:update_statut']], // Ajouter le groupe 'alerte:update_statut'
    operations: [
        new \ApiPlatform\Metadata\Post(
            controller: 'App\Controller\AlerteController::createSOS', 
            name: 'create_sos' 
        ),
        new \ApiPlatform\Metadata\Put(),
        new \ApiPlatform\Metadata\Patch(
            uriTemplate: '/alertes/{id}/statut',
            security: "is_granted('ROLE_SUPERVISEUR') or is_granted('ROLE_ADMIN')",
            denormalizationContext: ['groups' => ['alerte:update_statut']]
        ),
        new \ApiPlatform\Metadata\Delete(
            security: "is_granted('ROLE_SUPERVISEUR')",      
        ),
        new \ApiPlatform\Metadata\Get(),
    ]
)]
class Alerte
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['alerte:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['alerte:read', 'alerte:write', 'utilisateur:read'])]
    private ?\DateTimeInterface $dateCreation = null;

    #[ORM\Column(length: 255)]
    #[Groups(['alerte:read', 'alerte:write', 'utilisateur:read', 'alerte:update_statut'])]  // Ajout du groupe pour 'statut' dans la mise à jour
    #[Assert\NotBlank(message: 'Le statut est obligatoire.')]
    #[Assert\Choice(
        choices: ['EN_COURS', 'RESOLUE', 'ANNULEE'],
        message: 'Le statut doit être EN_COURS, RESOLUE ou ANNULEE.'
    )]
    private ?string $statut = 'EN_COURS';

    #[ORM\ManyToOne(inversedBy: 'alertes')]
    private ?Utilisateur $utilisateur = null;

    #[ORM\PrePersist]
    public function setDefaultDateCreation(): void
    {
        if ($this->dateCreation === null) {
            $this->dateCreation = new \DateTime();
        }
    }

    // Getters et setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->dateCreation;
    }

    public function setDateCreation(?\DateTimeInterface $dateCreation): static
    {
        $this->dateCreation = $dateCreation;
        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;
        return $this;
    }

    public function getUtilisateur(): ?Utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?Utilisateur $utilisateur): static
    {
        $this->utilisateur = $utilisateur;
        return $this;
    }
}
