import { Org } from '@prisma/client';
import { compare } from 'bcryptjs';

import { OrgsRepository } from '@/repositories/orgs-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  org: Org;
}

export class AuthenticateService {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const org = await this.orgsRepository.findByEmail(email);

    if (!org) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await compare(password, org.password);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return { org };
  }
}
