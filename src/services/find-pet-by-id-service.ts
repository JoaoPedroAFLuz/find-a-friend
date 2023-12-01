import { petMapper } from '@/mappers/pet-mapper';
import { PetsRepository } from '@/repositories/pets-repository';
import { ResourceNotFound } from './errors/resource-not-found-error';

interface FindPetByIdServiceRequest {
  petId: string;
}
export class FindPetByIdService {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ petId }: FindPetByIdServiceRequest) {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      throw new ResourceNotFound('Pet not found');
    }

    const petDto = petMapper.toDto(pet, pet.org);

    return { pet: petDto };
  }
}
