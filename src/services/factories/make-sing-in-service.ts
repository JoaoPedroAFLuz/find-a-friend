import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository';
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository';
import { SignInService } from '../sign-in-service';
import { makeFindLocalByPostalCodeService } from './make-find-location-by-postal-code-service';

export function makeSignInService() {
  const prismaOrgsRepository = new PrismaOrgsRepository();
  const prismaCitiesRepository = new PrismaCitiesRepository();
  const findLocalByPostalCodeService = makeFindLocalByPostalCodeService();

  return new SignInService(
    prismaOrgsRepository,
    prismaCitiesRepository,
    findLocalByPostalCodeService,
  );
}
