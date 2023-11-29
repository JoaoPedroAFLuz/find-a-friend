import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';

describe('Create Pet Controller', async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not be able to create a pet if the org is logged in', async () => {
    const singInResponse = await request(app.server)
      .post('/auth/sign-in')
      .send({
        name: "John Doe Org's",
        email: 'contato@johndoeorg.com.br',
        password: '123456789',
        address: 'Center',
        phone: '11922334455',
        responsibleName: 'John Doe',
        postalCode: '01001000',
      });

    const { token } = singInResponse.body;

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Bob',
        about: 'Friendly',
        age: 'PUPPY',
        port: 'SMALL',
        energyLevel: 'LOW',
        independenceLevel: 'LOW',
        environment: 'SMALL',
        photos: [],
        adoptionRequirements: [],
      });

    expect(response.statusCode).toEqual(201);
  });

  it('should not be able to create a pet if the org is not logged in', async () => {
    const response = await request(app.server).post('/pets').send({
      name: 'Bob',
      about: 'Friendly',
      age: 'PUPPY',
      port: 'SMALL',
      energyLevel: 'LOW',
      independenceLevel: 'LOW',
      environment: 'SMALL',
      photos: [],
      adoptionRequirements: [],
    });

    expect(response.statusCode).toEqual(401);
  });
});
