import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { PrismaCitiesRepository } from '@/repositories/prisma-cities-repository';
import { PrismaOrgsRepository } from '@/repositories/prisma-orgs-repository';
import { RegisterOrgService } from '@/services/register-org-service';

export async function registerOrgController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
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
    registerBodySchema.parse(request.body);

  const prismaOrgsRepository = new PrismaOrgsRepository();
  const prismaCitiesRepository = new PrismaCitiesRepository();
  const registerOrgService = new RegisterOrgService(
    prismaOrgsRepository,
    prismaCitiesRepository,
  );

  await registerOrgService.execute({
    name,
    email,
    password,
    address,
    phone,
    responsibleName,
    postalCode,
  });

  return reply.status(201).send();
}