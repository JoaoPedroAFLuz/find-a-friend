import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository';
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { CreatePetService } from '../create-pet-service';

export function makeCreatePetService() {
  const petsRepository = new PrismaPetsRepository();
  const orgsRepository = new PrismaOrgsRepository();

  return new CreatePetService(petsRepository, orgsRepository);
}
