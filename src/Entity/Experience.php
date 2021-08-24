<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ExperienceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ExperienceRepository::class)
 * @ApiResource(
 *  subresourceOperations={
 *      "api_employes_experiences_get_subresource"={
 *          "normalization_context"={"groups"= {"experiences_subresource"}}
 *      }
 *  },
 *  itemOperations={
 *     "GET",
 *     "PUT",
 *     "DELETE"
 *  },
 *  normalizationContext={"groups"= {"experiences_read"}},
 *  denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(OrderFilter::class)
 */
class Experience
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"experiences_read", "employes_read", "experiences_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"experiences_read", "employes_read", "experiences_subresource"})
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"experiences_read", "employes_read", "experiences_subresource"})
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity=Employe::class, inversedBy="experiences")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"experiences_read", "employes_read", "experiences_subresource"})
     */
    private $employe;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getEmploye(): ?Employe
    {
        return $this->employe;
    }

    public function setEmploye(?Employe $employe): self
    {
        $this->employe = $employe;

        return $this;
    }
}
