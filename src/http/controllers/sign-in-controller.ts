import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { EmailAlreadyInUseError } from '@/services/errors/email-already-in-use-error';
import { ResourceNotFound } from '@/services/errors/resource-not-found-error';
import { makeSignInService } from '@/services/factories/make-sing-in-service';

export async function signInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const singInBodySchema = z.object({
    name: z.string().min(3, 'Name must have at least 3 characters'),
    email: z.string().email('Email invalid'),
    password: z.string().min(8, 'Password must have at least 8 characters'),
    address: z.string().min(3, 'Address must have at least 3 characters'),
    phone: z.string().min(11, 'Phone must have at least 12 characters'),
    responsibleName: z
      .string()
      .min(3, 'Responsible name must have at least 3 characters'),
    postalCode: z
      .string()
      .min(8, 'Postal code must have 8 characters')
      .max(8, 'Postal code must have 8 characters'),
  });

  const { name, email, password, address, phone, responsibleName, postalCode } =
    singInBodySchema.parse(request.body);

  try {
    const signInService = makeSignInService();

    const { org } = await signInService.execute({
      name,
      email,
      password,
      address,
      phone,
      responsibleName,
      postalCode,
    });

    const token = await reply.jwtSign({}, { sign: { sub: org.id } });

    return reply.status(201).send({ token });
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (error instanceof EmailAlreadyInUseError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error;
  }
}
