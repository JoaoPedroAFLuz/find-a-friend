import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { OrgsRepository } from './orgs-repository';

export class PrismaOrgsRepository implements OrgsRepository {
  async create(data: Prisma.OrgUncheckedCreateInput) {
    return prisma.org.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return prisma.org.findUnique({
      where: {
        email,
      },
    });
  }
}
