import { hash } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { AuthenticateService } from './authenticate-service';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let sut: AuthenticateService;
let orgsRepository: OrgsRepository;

describe('Authenticate Service', () => {
  it('should be able to authenticate', async () => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new AuthenticateService(orgsRepository);

    const hashedPassword = await hash('12345678', 6);

    await orgsRepository.create({
      name: "John Doe Org's",
      email: 'contact@org.com',
      password: hashedPassword,
      address: 'Center',
      phone: '11911223344',
      responsible_name: 'John Doe',
      postal_code: '01001000',
      city_id: '591838fc-8c91-11ee-b9d1-0242ac120002',
      createdAt: '2023-01-01T00:00:00.000Z',
    });

    const credentials = {
      email: 'contact@org.com',
      password: '12345678',
    };

    const { org } = await sut.execute(credentials);

    expect(org.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new AuthenticateService(orgsRepository);

    const credentials = {
      email: 'contact@org.com',
      password: '12345678',
    };

    expect(async () => {
      await sut.execute(credentials);
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new AuthenticateService(orgsRepository);

    const hashedPassword = await hash('12345678', 6);

    await orgsRepository.create({
      name: "John Doe Org's",
      email: 'contact@org.com',
      password: hashedPassword,
      address: 'Center',
      phone: '11911223344',
      responsible_name: 'John Doe',
      postal_code: '01001000',
      city_id: '591838fc-8c91-11ee-b9d1-0242ac120002',
      createdAt: '2023-01-01T00:00:00.000Z',
    });

    const invalidCredentials = {
      email: 'contact@org.com',
      password: '87654321',
    };

    expect(async () => {
      await sut.execute(invalidCredentials);
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
