import {
  AgeEnum,
  EnergyLevelEnum,
  EnvironmentEnum,
  IndependenceLevelEnum,
  Pet,
  PortEnum,
} from '@prisma/client';

import { CitiesRepository } from '@/repositories/cities-repository';
import { PetsRepository } from '@/repositories/pets-repository';

import { ResourceNotFound } from './errors/resource-not-found-error';

interface FindPetsServiceRequest {
  cityName: string;
  stateAbbreviation: string;
  age?: AgeEnum;
  port?: PortEnum;
  energyLevel?: EnergyLevelEnum;
  independenceLevel?: IndependenceLevelEnum;
  environment?: EnvironmentEnum;
  page?: number;
}

interface FindPetsServiceResponse {
  pets: Pet[];
}

export class FindPetsService {
  constructor(
    private petsRepository: PetsRepository,
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({
    cityName,
    stateAbbreviation,
    age,
    port,
    energyLevel,
    independenceLevel,
    environment,
    page = 1,
  }: FindPetsServiceRequest): Promise<FindPetsServiceResponse> {
    const city = await this.citiesRepository.findByCityNameAndStateAbbreviation(
      cityName,
      stateAbbreviation,
    );

    if (!city) {
      throw new ResourceNotFound('City not found');
    }

    const pets = await this.petsRepository.findMany({
      where: {
        org: {
          city_id: city.id,
        },
        age,
        port,
        energy_level: energyLevel,
        independence_level: independenceLevel,
        environment,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return { pets };
  }
}
