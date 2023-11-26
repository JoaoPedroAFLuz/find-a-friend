import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository';
import { AuthenticateService } from '../authenticate-service';

export function makeAuthenticateService() {
  const orgsRepository = new PrismaOrgsRepository();

  return new AuthenticateService(orgsRepository);
}
