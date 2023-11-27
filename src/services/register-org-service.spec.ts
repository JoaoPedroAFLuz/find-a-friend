import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { EmailAlreadyInUseError } from '@/services/errors/email-already-in-use-error';
import { ResourceNotFound } from '@/services/errors/resource-not-found-error';
import { randomUUID } from 'crypto';
import { FindLocationByPostalCodeService } from './find-location-by-postal-code-service';
import { RegisterOrgService } from './register-org-service';

let sut: RegisterOrgService;
let orgsRepository: InMemoryOrgsRepository;
let citiesRepository: InMemoryCitiesRepository;
let findLocalByPostalCodeService: FindLocationByPostalCodeService;

describe('Register Org Service', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    citiesRepository = new InMemoryCitiesRepository();
    findLocalByPostalCodeService = new FindLocationByPostalCodeService();

    sut = new RegisterOrgService(
      orgsRepository,
      citiesRepository,
      findLocalByPostalCodeService,
    );

    citiesRepository.states.push({
      id: randomUUID(),
      name: 'São Paulo',
      abbreviation: 'SP',
    });

    citiesRepository.cities.push({
      id: randomUUID(),
      name: 'São Paulo',
      state_id: citiesRepository.states[0].id,
    });

    const mockLocation = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107',
    };

    vi.spyOn(findLocalByPostalCodeService, 'execute').mockImplementation(
      async () => mockLocation,
    );
  });

  it('should be able to create an org', async () => {
    const { org } = await sut.execute({
      name: "John Doe Org's",
      email: 'contact@org.com',
      password: '12345678',
      address: 'Center',
      phone: '11911223344',
      responsibleName: 'John Doe',
      postalCode: '01001000',
    });

    expect(org.id).toEqual(expect.any(String));
  });

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute({
      name: "John Doe Org's",
      email: 'contact@org.com',
      password: '12345678',
      address: 'Center',
      phone: '11911223344',
      responsibleName: 'John Doe',
      postalCode: '01001000',
    });

    const isPasswordCorrectlyHashed = await compare('12345678', org.password);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to create an org if e-mail already in use', async () => {
    await sut.execute({
      name: "John Doe Org's",
      email: 'contact@org.com',
      password: '12345678',
      address: 'Center',
      phone: '11911223344',
      responsibleName: 'John Doe',
      postalCode: '01001000',
    });

    expect(async () => {
      await sut.execute({
        name: "John Doe Org's",
        email: 'contact@org.com',
        password: '12345678',
        address: 'Center',
        phone: '11911223344',
        responsibleName: 'John Doe',
        postalCode: '01001000',
      });
    }).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it('should not be able to create an org if city not found', async () => {
    const mockLocationWithUnknownCity = {
      cep: '20010-020',
      logradouro: 'Rua São José',
      complemento: '',
      bairro: 'Centro',
      localidade: 'Rio de Janeiro',
      uf: 'RJ',
      ibge: '3304557',
      gia: '',
      ddd: '21',
      siafi: '6001',
    };

    vi.spyOn(findLocalByPostalCodeService, 'execute').mockImplementation(
      async () => mockLocationWithUnknownCity,
    );

    expect(async () => {
      await sut.execute({
        name: "John Doe Org's",
        email: 'contact@org.com',
        password: '12345678',
        address: 'Center',
        phone: '11911223344',
        responsibleName: 'John Doe',
        postalCode: '01001000',
      });
    }).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
