import { Org, Prisma } from '@prisma/client';

import { randomUUID } from 'crypto';
import { OrgsRepository } from '../orgs-repository';

export class InMemoryOrgsRepository implements OrgsRepository {
  items: Org[] = [];

  async create({
    name,
    email,
    address,
    password,
    phone,
    postal_code,
    city_id,
    responsible_name,
  }: Prisma.OrgUncheckedCreateInput) {
    const org: Org = {
      id: randomUUID(),
      address,
      email,
      name,
      password,
      phone,
      postal_code,
      city_id,
      responsible_name,
      createdAt: new Date(),
    };

    this.items.push(org);

    return org;
  }
  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email);

    return org || null;
  }
}
