import { Pet } from '@prisma/client';

import { PetInputDTO } from '@/services/dtos/pet-dto';

export interface PetsRepository {
  create(data: PetInputDTO): Promise<Pet>;
}
