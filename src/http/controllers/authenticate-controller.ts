import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository';
import { AuthenticateService } from '@/services/authenticate-service';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email('Email invalid'),
    password: z.string().min(8, 'Password must have at least 8 characters'),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const orgsRepository = new PrismaOrgsRepository();
    const authenticateService = new AuthenticateService(orgsRepository);

    await authenticateService.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(200).send();
}
