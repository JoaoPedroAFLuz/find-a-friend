import { Pet, Prisma } from '@prisma/client';

import { PetInputDTO } from '@/services/dtos/pet-dto';

export interface PetsRepository {
  create(data: PetInputDTO): Promise<Pet>;
  findMany(data: Prisma.PetFindManyArgs): Promise<Pet[]>;
}
