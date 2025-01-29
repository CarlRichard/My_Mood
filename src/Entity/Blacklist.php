<?php
namespace App\Entity;

use App\Repository\BlacklistRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity(repositoryClass: BlacklistRepository::class)]
#[ApiResource]
class Blacklist
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Utilisateur::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Utilisateur $utilisateur = null;

    #[ORM\ManyToOne(targetEntity: Utilisateur::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Utilisateur $superviseur = null; // Ajout de la relation avec le superviseur

    public function getId(): ?int
    {
        return $this->id;
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

    public function getSuperviseur(): ?Utilisateur
    {
        return $this->superviseur;
    }

    public function setSuperviseur(?Utilisateur $superviseur): static
    {
        $this->superviseur = $superviseur;
        return $this;
    }
}
