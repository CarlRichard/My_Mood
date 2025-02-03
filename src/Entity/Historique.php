<?php
namespace App\Entity;

use App\Repository\HistoriqueRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HistoriqueRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['historique:read']],
    denormalizationContext: ['groups' => ['historique:write']]
)]
class Historique
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['historique:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['historique:read', 'utilisateur:read'])]
    private ?\DateTimeInterface $dateCreation  = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['historique:read', 'utilisateur:read'])]
    private ?int $humeur = null;

    #[ORM\ManyToOne(targetEntity: Utilisateur::class, inversedBy: 'historiques')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['historique:read'])] 
    private ?Utilisateur $utilisateur = null;

    // Getters et setters pour id, dateCreation, humeur, utilisateur

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateCreation (): ?\DateTimeInterface
    {
        return $this->dateCreation ;
    }

    public function setDateCreation (\DateTimeInterface $dateCreation ): static
    {
        $this->dateCreation  = $dateCreation ;
        return $this;
    }

    public function getHumeur(): ?int
    {
        return $this->humeur;
    }

    public function setHumeur(?int $Humeur): static
    {
        $this->humeur = $Humeur;
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
