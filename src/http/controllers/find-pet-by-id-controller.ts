import { ResourceNotFound } from '@/services/errors/resource-not-found-error';
import { makeFindPetByIdService } from '@/services/factories/make-find-pet-by-id-service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function findPetByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findPetByIdParams = z.object({
    petId: z.string(),
  });

  const { petId } = findPetByIdParams.parse(request.params);

  try {
    const findPetByIdService = makeFindPetByIdService();

    const { pet } = await findPetByIdService.execute({
      petId,
    });

    return reply.send({ pet });
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
}
