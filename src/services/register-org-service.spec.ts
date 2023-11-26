import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CitiesRepository } from '@/repositories/cities-repository';
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository';
import { OrgsRepository } from '@/repositories/orgs-repository';
import { EmailAlreadyInUseError } from '@/services/errors/email-already-in-use-error';
import { ResourceNotFound } from '@/services/errors/resource-not-found-error';
import { FindLocalByPostalCodeService } from './find-locate-by-postal-code-service';
import { RegisterOrgService } from './register-org-service';

let sut: RegisterOrgService;
let orgsRepository: OrgsRepository;
let citiesRepository: CitiesRepository;
let findLocalByPostalCodeService: FindLocalByPostalCodeService;

describe('Register Org Service', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    citiesRepository = new InMemoryCitiesRepository();
    findLocalByPostalCodeService = new FindLocalByPostalCodeService();
  });

  it('should be able to create an org', async () => {
    sut = new RegisterOrgService(
      orgsRepository,
      citiesRepository,
      findLocalByPostalCodeService,
    );

    const mockLocate = {
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
      async () => mockLocate,
    );

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
    sut = new RegisterOrgService(
      orgsRepository,
      citiesRepository,
      findLocalByPostalCodeService,
    );

    const mockLocate = {
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
      async () => mockLocate,
    );

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
    sut = new RegisterOrgService(
      orgsRepository,
      citiesRepository,
      findLocalByPostalCodeService,
    );

    const mockLocate = {
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
      async () => mockLocate,
    );

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
    sut = new RegisterOrgService(
      orgsRepository,
      citiesRepository,
      findLocalByPostalCodeService,
    );

    const mockLocate = {
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
      async () => mockLocate,
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
