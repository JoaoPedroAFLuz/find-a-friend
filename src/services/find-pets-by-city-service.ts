import { Pet } from '@prisma/client';

import { CitiesRepository } from '@/repositories/cities-repository';
import { PetsRepository } from '@/repositories/pets-repository';
import { ResourceNotFound } from './errors/resource-not-found-error';

interface FindPetsByCityServiceRequest {
  cityName: string;
  stateAbbreviation: string;
}

interface FindPetsByCityServiceResponse {
  pets: Pet[];
}

export class FindPetsByCityService {
  constructor(
    private petsRepository: PetsRepository,
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({
    cityName,
    stateAbbreviation,
  }: FindPetsByCityServiceRequest): Promise<FindPetsByCityServiceResponse> {
    const city = await this.citiesRepository.findByCityNameAndStateAbbreviation(
      cityName,
      stateAbbreviation,
    );

    if (!city) {
      throw new ResourceNotFound('City not found');
    }

    const pets = await this.petsRepository.findByCityId(city.id);

    return { pets };
  }
}
