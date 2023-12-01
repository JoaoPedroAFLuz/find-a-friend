import { Org, Pet } from '@prisma/client';

import { OrgDTO } from '@/services/dtos/org-dto';
import { PetDTO } from '@/services/dtos/pet-dto';

export class PetMapper {
  toDto(pet: Pet, org: Org) {
    const orgDto: OrgDTO = {
      id: org.id,
      name: org.name,
      email: org.email,
      address: org.address,
      phone: org.phone,
      postal_code: org.postal_code,
      created_at: org.createdAt,
    };

    const petDto: PetDTO = {
      id: pet.id,
      org: orgDto,
      name: pet.name,
      about: pet.about,
      age: pet.age,
      port: pet.port,
      energyLevel: pet.energy_level,
      independenceLevel: pet.independence_level,
      environment: pet.environment,
      photos: pet.photos,
      adoptionRequirements: pet.adoption_requirements,
      createdAt: pet.created_at,
    };

    return petDto;
  }
}

export const petMapper = new PetMapper();
