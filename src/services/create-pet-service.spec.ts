import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import { randomUUID } from 'crypto';
import {
  CreatePetService,
  CreatePetServiceRequest,
} from './create-pet-service';
import {
  PetAge,
  PetEnergyLevel,
  PetEnvironment,
  PetIndependenceLevel,
  PetPort,
} from './dtos/pet-dto';
import { ResourceNotFound } from './errors/resource-not-found-error';

let sut: CreatePetService;
let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;

describe('Create Pet Service', async () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    orgsRepository = new InMemoryOrgsRepository();
    sut = new CreatePetService(petsRepository, orgsRepository);
  });

  it('should be able do create a new pet', async () => {
    const org = await orgsRepository.create({
      id: randomUUID(),
      city_id: randomUUID(),
      name: "John Doe Org's",
      email: 'contact@org.com',
      password: '12345678',
      address: 'Center',
      phone: '11911223344',
      responsible_name: 'John Doe',
      postal_code: '01001000',
      createdAt: new Date(),
    });

    const newPet: CreatePetServiceRequest = {
      orgId: org.id,
      name: 'Bob',
      about: 'Friendly dog',
      age: PetAge.PUPPY,
      port: PetPort.SMALL,
      energyLevel: PetEnergyLevel.LOW,
      independenceLevel: PetIndependenceLevel.LOW,
      environment: PetEnvironment.SMALL,
      photos: [],
      adoptionRequirements: [],
    };

    const { pet } = await sut.execute(newPet);

    expect(pet.id).toEqual(expect.any(String));
  });

  it("should not be able to create a new pet if org doesn't exists", async () => {
    const newPet: CreatePetServiceRequest = {
      orgId: 'invalid-org-id',
      name: 'Bob',
      about: 'Friendly dog',
      age: PetAge.PUPPY,
      port: PetPort.SMALL,
      energyLevel: PetEnergyLevel.LOW,
      independenceLevel: PetIndependenceLevel.LOW,
      environment: PetEnvironment.SMALL,
      photos: [],
      adoptionRequirements: [],
    };

    expect(async () => {
      await sut.execute(newPet);
    }).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
