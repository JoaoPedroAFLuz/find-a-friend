import { Pet } from '@prisma/client';

import { OrgsRepository } from '@/repositories/orgs-repository';
import { PetsRepository } from '@/repositories/pets-repository';
import { PetInputDTO } from './dtos/pet-dto';
import { ResourceNotFound } from './errors/resource-not-found-error';

export interface CreatePetServiceRequest extends PetInputDTO {}

interface CreatePetServiceResponse {
  pet: Pet;
}

export class CreatePetService {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute(
    data: CreatePetServiceRequest,
  ): Promise<CreatePetServiceResponse> {
    const org = await this.orgsRepository.findById(data.orgId);

    if (!org) {
      throw new ResourceNotFound('Org not found');
    }

    const pet = await this.petsRepository.create(data);

    return { pet };
  }
}
