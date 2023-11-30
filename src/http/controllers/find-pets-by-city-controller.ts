import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFound } from '@/services/errors/resource-not-found-error';
import { makeFindPetsByCityService } from '@/services/factories/make-find-pets-by-city-service';

export async function findPetsByCityController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findPetsByCityParamsSchema = z.object({
    cityName: z.string(),
    stateAbbreviation: z.string(),
  });

  const { cityName, stateAbbreviation } = findPetsByCityParamsSchema.parse(
    request.query,
  );

  try {
    const findPetsByCityService = makeFindPetsByCityService();

    const { pets } = await findPetsByCityService.execute({
      cityName,
      stateAbbreviation,
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
