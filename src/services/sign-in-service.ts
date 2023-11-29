import { Org } from '@prisma/client';
import { hash } from 'bcryptjs';

import { CitiesRepository } from '@/repositories/cities-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { EmailAlreadyInUseError } from '@/services/errors/email-already-in-use-error';
import { ResourceNotFound } from '@/services/errors/resource-not-found-error';
import { FindLocationByPostalCodeService } from './find-location-by-postal-code-service';

interface SignInServiceRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  responsibleName: string;
  postalCode: string;
}

interface SignInServiceResponse {
  org: Org;
}

export class SignInService {
  constructor(
    private orgsRepository: OrgsRepository,
    private citiesRepository: CitiesRepository,
    private findLocalByPostalCodeService: FindLocationByPostalCodeService,
  ) {}

  async execute({
    name,
    email,
    password,
    address,
    phone,
    responsibleName,
    postalCode,
  }: SignInServiceRequest): Promise<SignInServiceResponse> {
    const emailAlreadyInUse = await this.orgsRepository.findByEmail(email);

    if (emailAlreadyInUse) {
      throw new EmailAlreadyInUseError();
    }

    const location = await this.findLocalByPostalCodeService.execute({
      postalCode,
    });

    const city = await this.citiesRepository.findByCityNameAndStateAbbreviation(
      location.localidade,
      location.uf,
    );

    if (!city) {
      throw new ResourceNotFound('City not found');
    }

    const passwordHash = await hash(password, 6);

    const org = await this.orgsRepository.create({
      name,
      city_id: city.id,
      email,
      password: passwordHash,
      address,
      phone,
      responsible_name: responsibleName,
      postal_code: postalCode,
    });

    return { org };
  }
}
