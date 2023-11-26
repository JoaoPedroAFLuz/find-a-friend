import { Org } from '@prisma/client';
import { hash } from 'bcryptjs';

import { CitiesRepository } from '@/repositories/cities-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { CityNotFoundError } from '@/services/errors/city-not-found-error';
import { EmailAlreadyInUseError } from '@/services/errors/email-already-in-use-error';
import { FindLocalByPostalCodeService } from './find-locate-by-postal-code-service';

interface RegisterOrgServiceRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  responsibleName: string;
  postalCode: string;
}

interface RegisterOrgServiceResponse {
  org: Org;
}

export class RegisterOrgService {
  constructor(
    private orgsRepository: OrgsRepository,
    private citiesRepository: CitiesRepository,
    private findLocalByPostalCodeService: FindLocalByPostalCodeService,
  ) {}

  async execute({
    name,
    email,
    password,
    address,
    phone,
    responsibleName,
    postalCode,
  }: RegisterOrgServiceRequest): Promise<RegisterOrgServiceResponse> {
    const emailAlreadyInUse = await this.orgsRepository.findByEmail(email);

    if (emailAlreadyInUse) {
      throw new EmailAlreadyInUseError();
    }

    const locate = await this.findLocalByPostalCodeService.execute({
      postalCode,
    });

    const city = await this.citiesRepository.findByCityNameAndStateAbbreviation(
      locate.localidade,
      locate.uf,
    );

    if (!city) {
      throw new CityNotFoundError();
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
