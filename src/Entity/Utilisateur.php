<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\Cohorte;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new \ApiPlatform\Metadata\GetCollection(),
        new \ApiPlatform\Metadata\Get(),
        new \ApiPlatform\Metadata\Delete(),
        new \ApiPlatform\Metadata\Post(
            uriTemplate: '/utilisateurs',
            controller: 'App\Controller\UtilisateurController::createUser'
        ),
    ],
    normalizationContext: ['groups' => ['utilisateur:read']], // Groupe global pour la lecture des utilisateurs
)]
#[ORM\Table(name: 'utilisateur')]
class Utilisateur implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['utilisateur:read', 'cohorte:read'])] 
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['utilisateur:read'])] 
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['utilisateur:read'])] 
    private array $roles = ["ROLE_ETUDIANT"];

    #[ORM\Column(length: 255)]
    #[Groups(['utilisateur:read', 'cohorte:read'])] 
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['utilisateur:read', 'cohorte:read'])] 
    private ?string $prenom = null;

    #[ORM\Column]
    private ?string $password = null;

    /**
     * @var Collection<int, Cohorte>
     */
    #[ORM\ManyToMany(targetEntity: Cohorte::class, inversedBy: 'utilisateurs')]
    #[ORM\JoinTable(name: 'utilisateur_cohorte')]  
    #[Groups(['utilisateur:read'])] 
    private Collection $groupes;

    /**
     * @var Collection<int, Alerte>
     */
    #[ORM\OneToMany(targetEntity: Alerte::class, mappedBy: 'utilisateur')]
    private Collection $alertes;

    public function __construct()
    {
        $this->groupes = new ArrayCollection();
        $this->alertes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(?string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(?string $prenom): self
    {
        $this->prenom = $prenom;

        return $this;
    }

    // Méthodes requises par UserInterface
    public function eraseCredentials(): void
    {
        // Si des données sensibles sont temporairement stockées, nettoyez-les ici.
    }

    public function getUserIdentifier(): string
    {
        // surement une une methode d'ancienne version symfony
        return $this->email;
    }

    /**
     * @return Collection<int, Cohorte>
     */
    public function getGroupes(): Collection
    {
        return $this->groupes;
    }

    public function addGroupe(Cohorte $groupe): self
    {
        if (!$this->groupes->contains($groupe)) {
            $this->groupes->add($groupe);
        }

        return $this;
    }

    public function removeGroupe(Cohorte $groupe): self
    {
        $this->groupes->removeElement($groupe);

        return $this;
    }

    /**
     * @return Collection<int, Alerte>
     */
    public function getAlertes(): Collection
    {
        return $this->alertes;
    }

    public function addAlerte(Alerte $alerte): static
    {
        if (!$this->alertes->contains($alerte)) {
            $this->alertes->add($alerte);
            $alerte->setUtilisateur($this);
        }

        return $this;
    }

    public function removeAlerte(Alerte $alerte): static
    {
        if ($this->alertes->removeElement($alerte)) {
            // set the owning side to null (unless already changed)
            if ($alerte->getUtilisateur() === $this) {
                $alerte->setUtilisateur(null);
            }
        }

        return $this;
    }
}
