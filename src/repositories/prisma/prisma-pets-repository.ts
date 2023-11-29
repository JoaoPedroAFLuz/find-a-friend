import { prisma } from '@/lib/prisma';
import { PetInputDTO } from '@/services/dtos/pet-dto';
import { PetsRepository } from '../pets-repository';

export class PrismaPetsRepository implements PetsRepository {
  async create({
    orgId,
    energyLevel,
    independenceLevel,
    adoptionRequirements,
    ...data
  }: PetInputDTO) {
    {
      return prisma.pet.create({
        data: {
          org_id: orgId,
          energy_level: energyLevel,
          independence_level: independenceLevel,
          adoption_requirements: adoptionRequirements,
          ...data,
        },
      });
    }
  }
}
