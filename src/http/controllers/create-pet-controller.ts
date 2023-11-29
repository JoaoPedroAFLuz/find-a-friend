import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import {
  PetAge,
  PetEnergyLevel,
  PetEnvironment,
  PetIndependenceLevel,
  PetPort,
} from '@/services/dtos/pet-dto';
import { ResourceNotFound } from '@/services/errors/resource-not-found-error';
import { makeCreatePetService } from '@/services/factories/make-create-pet-service';

export async function createPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const orgId = request.user.sub;

  const createPetBodySchema = z.object({
    name: z.string().min(3, 'Name must have at least 3 characters'),
    about: z.string().min(3, 'About must have at least 3 characters'),
    age: z.nativeEnum(PetAge),
    port: z.nativeEnum(PetPort),
    energyLevel: z.nativeEnum(PetEnergyLevel),
    independenceLevel: z.nativeEnum(PetIndependenceLevel),
    environment: z.nativeEnum(PetEnvironment),
    photos: z.array(z.string()),
    adoptionRequirements: z.array(z.string()),
  });

  const {
    name,
    about,
    age,
    port,
    energyLevel,
    independenceLevel,
    environment,
    photos,
    adoptionRequirements,
  } = createPetBodySchema.parse(request.body);

  try {
    const createPetService = makeCreatePetService();

    await createPetService.execute({
      orgId,
      name,
      about,
      age,
      port,
      energyLevel,
      independenceLevel,
      environment,
      photos,
      adoptionRequirements,
    });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
}
