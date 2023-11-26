import axios from 'axios';
import { hash } from 'bcryptjs';

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
      throw new Error('Email already in use');
    }

    const cityData = await this.getCityData(postalCode);

    const city = await this.citiesRepository.findByCityNameAndStateAbbreviation(
      cityData.name,
      cityData.uf,
    );

    if (!city) {
      throw new Error('City not found');
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

    return data;
  }
}
