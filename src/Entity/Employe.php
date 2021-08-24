<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use App\Repository\EmployeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=EmployeRepository::class)
 * @ApiResource(
 *  forceEager=false,
 *  collectionOperations={
 *     "GET",
 *     "POST"
 *  },
 *  itemOperations={
 *     "GET",
 *     "PUT",
 *     "DELETE"
 *  },
 *  subresourceOperations={
 *      "experiences_get_subresource"={"path"="/employe/{id}/experiences"}
 *  },
 *  normalizationContext={
 *      "groups"={"employes_read"},
 *      "enable_max_depth"=true
 *  },
 *  denormalizationContext={
 *      "groups"={"employes_write"},
 *      "enable_max_depth"=true
 *  }
 * )
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(OrderFilter::class)
 */
class Employe
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"employes_read", "experiences_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"employes_read", "experiences_read", "employes_write"})
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"employes_read", "experiences_read", "employes_write"})
     */
    private $lastName;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"employes_read", "experiences_read", "employes_write"})
     */
    private $age;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"employes_read", "experiences_read", "employes_write"})
     */
    private $poste;

    /**
     * @ORM\OneToMany(targetEntity=Experience::class, mappedBy="employe", cascade={"remove"})
     * @Groups({"employes_read"})
     * @ApiSubresource()
     */
    private $experiences;

    public function __construct()
    {
        $this->experiences = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getAge(): ?int
    {
        return $this->age;
    }

    public function setAge(int $age): self
    {
        $this->age = $age;

        return $this;
    }

    public function getPoste(): ?string
    {
        return $this->poste;
    }

    public function setPoste(string $poste): self
    {
        $this->poste = $poste;

        return $this;
    }

    /**
     * @return Collection|Experience[]
     */
    public function getExperiences(): Collection
    {
        return $this->experiences;
    }

    public function addExperience(Experience $experience): self
    {
        if (!$this->experiences->contains($experience)) {
            $this->experiences[] = $experience;
            $experience->setEmploye($this);
        }

        return $this;
    }

    public function removeExperience(Experience $experience): self
    {
        if ($this->experiences->removeElement($experience)) {
            // set the owning side to null (unless already changed)
            if ($experience->getEmploye() === $this) {
                $experience->setEmploye(null);
            }
        }

        return $this;
    }
}
