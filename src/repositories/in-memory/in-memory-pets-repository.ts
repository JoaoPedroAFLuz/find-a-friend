import { Pet } from '@prisma/client';
import { randomUUID } from 'node:crypto';

import { PetInputDTO } from '@/services/dtos/pet-dto';
import { PetsRepository } from '../pets-repository';

export class InMemoryPetsRepository implements PetsRepository {
  items: Pet[] = [];

  async create({
    orgId,
    name,
    about,
    age,
    port,
    energyLevel,
    independenceLevel,
    environment,
    photos,
    adoptionRequirements,
  }: PetInputDTO) {
    const pet: Pet = {
      id: randomUUID(),
      org_id: orgId,
      name,
      about,
      age,
      port,
      energy_level: energyLevel,
      independence_level: independenceLevel,
      environment,
      photos,
      adoption_requirements: adoptionRequirements,
      created_at: new Date(),
    };

    this.items.push(pet);

    return pet;
  }
}
