import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFound } from '@/services/errors/resource-not-found-error';
import { makeCreatePetService } from '@/services/factories/make-create-pet-service';
import {
  AgeEnum,
  EnergyLevelEnum,
  EnvironmentEnum,
  IndependenceLevelEnum,
  PortEnum,
} from '@prisma/client';

export async function createPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const orgId = request.user.sub;

  const createPetBodySchema = z.object({
    name: z.string().min(3, 'Name must have at least 3 characters'),
    about: z.string().min(3, 'About must have at least 3 characters'),
    age: z.nativeEnum(AgeEnum),
    port: z.nativeEnum(PortEnum),
    energyLevel: z.nativeEnum(EnergyLevelEnum),
    independenceLevel: z.nativeEnum(IndependenceLevelEnum),
    environment: z.nativeEnum(EnvironmentEnum),
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
