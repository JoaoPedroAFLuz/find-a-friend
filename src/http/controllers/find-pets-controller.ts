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
import { makeFindPetsService } from '@/services/factories/make-find-pets-service';

export async function findPetsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findPetsParamsSchema = z.object({
    cityName: z.string(),
    stateAbbreviation: z.string(),
    age: z.nativeEnum(PetAge).optional(),
    port: z.nativeEnum(PetPort).optional(),
    energyLevel: z.nativeEnum(PetEnergyLevel).optional(),
    independenceLevel: z.nativeEnum(PetIndependenceLevel).optional(),
    environment: z.nativeEnum(PetEnvironment).optional(),
    page: z.coerce.number().positive().default(1),
  });

  const {
    cityName,
    stateAbbreviation,
    age,
    port,
    energyLevel,
    independenceLevel,
    environment,
  } = findPetsParamsSchema.parse(request.query);

  try {
    const findPetsByCityService = makeFindPetsService();

    const { pets } = await findPetsByCityService.execute({
      cityName,
      stateAbbreviation,
      age,
      port,
      energyLevel,
      independenceLevel,
      environment,
    });

    return reply.send({ pets });
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
}
