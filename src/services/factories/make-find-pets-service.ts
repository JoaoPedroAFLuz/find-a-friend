import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository';
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { FindPetsService } from '../find-pets-service';

export function makeFindPetsService() {
  const petsRepository = new PrismaPetsRepository();
  const citiesRepository = new PrismaCitiesRepository();

  return new FindPetsService(petsRepository, citiesRepository);
}
