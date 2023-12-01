import { Org, Pet, Prisma } from '@prisma/client';

import { PetInputDTO } from '@/services/dtos/pet-dto';

export type PetWithOrg = Pet & {
  org: Org;
};

export interface PetsRepository {
  create(data: PetInputDTO): Promise<Pet>;
  findById(id: string): Promise<PetWithOrg | null>;
  findMany(data: Prisma.PetFindManyArgs): Promise<Pet[]>;
}
