import { Prisma } from '@prisma/client';

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

  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
      include: {
        org: true,
      },
    });

    return pet || null;
  }

  async findMany(data: Prisma.PetFindManyArgs) {
    return prisma.pet.findMany(data);
  }
}
