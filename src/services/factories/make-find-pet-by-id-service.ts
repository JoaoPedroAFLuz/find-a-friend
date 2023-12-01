import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { FindPetByIdService } from '../find-pet-by-id-service';

export function makeFindPetByIdService() {
  const petsRepository = new PrismaPetsRepository();

  return new FindPetByIdService(petsRepository);
}
