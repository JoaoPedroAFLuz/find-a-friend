import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository';
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { FindPetsByCityService } from '../find-pets-by-city-service';

export function makeFindPetsByCityService() {
  const petsRepository = new PrismaPetsRepository();
  const citiesRepository = new PrismaCitiesRepository();

  return new FindPetsByCityService(petsRepository, citiesRepository);
}
