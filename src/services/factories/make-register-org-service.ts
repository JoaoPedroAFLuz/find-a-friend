import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository';
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository';
import { RegisterOrgService } from '../register-org-service';
import { makeFindLocalByPostalCodeService } from './make-find-location-by-postal-code-service';

export function makeRegisterOrgService() {
  const prismaOrgsRepository = new PrismaOrgsRepository();
  const prismaCitiesRepository = new PrismaCitiesRepository();
  const findLocalByPostalCodeService = makeFindLocalByPostalCodeService();

  return new RegisterOrgService(
    prismaOrgsRepository,
    prismaCitiesRepository,
    findLocalByPostalCodeService,
  );
}
