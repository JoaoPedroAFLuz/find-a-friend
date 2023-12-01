import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFound } from '@/services/errors/resource-not-found-error';
import { makeFindPetsService } from '@/services/factories/make-find-pets-service';
import {
  AgeEnum,
  EnergyLevelEnum,
  EnvironmentEnum,
  IndependenceLevelEnum,
  PortEnum,
} from '@prisma/client';

export async function findPetsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findPetsParamsSchema = z.object({
    cityName: z.string(),
    stateAbbreviation: z.string(),
    age: z.nativeEnum(AgeEnum).optional(),
    port: z.nativeEnum(PortEnum).optional(),
    energyLevel: z.nativeEnum(EnergyLevelEnum).optional(),
    independenceLevel: z.nativeEnum(IndependenceLevelEnum).optional(),
    environment: z.nativeEnum(EnvironmentEnum).optional(),
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
