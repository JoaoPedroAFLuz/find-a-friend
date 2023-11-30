import { Pet } from '@prisma/client';

import { PetInputDTO } from '@/services/dtos/pet-dto';

export interface PetsRepository {
  create(data: PetInputDTO): Promise<Pet>;
  findByCityId(cityId: string): Promise<Pet[]>;
}
