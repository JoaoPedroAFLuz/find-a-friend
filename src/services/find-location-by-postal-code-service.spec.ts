import { beforeEach, describe, expect, it } from 'vitest';

import { InvalidPostalCodeError } from './errors/invalid-postal-code-error';
import { ResourceNotFound } from './errors/resource-not-found-error';
import { FindLocationByPostalCodeService } from './find-location-by-postal-code-service';

let sut: FindLocationByPostalCodeService;

describe('Find Location By Postal Code Service', () => {
  beforeEach(() => {
    sut = new FindLocationByPostalCodeService();
  });

  it('should be able to find location by postal code', async () => {
    const postalCode = '01001000';

    const location = await sut.execute({
      postalCode,
    });

    expect(location.cep).toEqual('01001-000');
    expect(location.localidade).toEqual('São Paulo');
  });

  it('should be not able to find location if postal code is invalid', async () => {
    const invalidPostalCodeOne = '1234567';
    const invalidPostalCodeTwo = 'ABCDEFGH';

    expect(async () => {
      await sut.execute({
        postalCode: invalidPostalCodeOne,
      });
    }).rejects.toBeInstanceOf(InvalidPostalCodeError);

    expect(async () => {
      await sut.execute({
        postalCode: invalidPostalCodeTwo,
      });
    }).rejects.toBeInstanceOf(InvalidPostalCodeError);
  });

  it('should be not able to find location if postal code not found', async () => {
    const postalCode = '00000000';

    expect(async () => {
      await sut.execute({
        postalCode,
      });
    }).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
