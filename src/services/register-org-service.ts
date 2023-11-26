import axios from 'axios';
import { hash } from 'bcryptjs';

import { CityNotFoundError } from '@/errors/city-not-found-error';
import { EmailAlreadyInUseError } from '@/errors/email-already-in-use-error';
import { PostalCodeNotFoundError } from '@/errors/postal-code-not-found-error';
import { CitiesRepository } from '@/repositories/cities-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';

interface RegisterOrgServiceRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  responsibleName: string;
  postalCode: string;
}

export class RegisterOrgService {
  constructor(
    private orgsRepository: OrgsRepository,
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({
    name,
    email,
    password,
    address,
    phone,
    responsibleName,
    postalCode,
  }: RegisterOrgServiceRequest) {
    const emailAlreadyInUse = await this.orgsRepository.findByEmail(email);

    if (emailAlreadyInUse) {
      throw new EmailAlreadyInUseError();
    }

    const cityData = await this.getCityData(postalCode);

    if (!cityData) {
      throw new PostalCodeNotFoundError();
    }

    const city = await this.citiesRepository.findByCityNameAndStateAbbreviation(
      cityData.name,
      cityData.uf,
    );

    if (!city) {
      throw new CityNotFoundError();
    }

    const passwordHash = await hash(password, 6);

    await this.orgsRepository.create({
      name,
      city_id: city.id,
      email,
      password: passwordHash,
      address,
      phone,
      responsible_name: responsibleName,
      postal_code: postalCode,
    });
  }

  private async getCityData(postalCode: string) {
    const { data } = await axios.get(
      `https://viacep.com.br/ws/${postalCode}/json`,
    );

    if (data.erro) {
      throw new PostalCodeNotFoundError();
    }

    return data;
  }
}
