import { describe, expect, it } from 'vitest';

import { InvalidPostalCodeError } from './errors/invalid-postal-code-error';
import { PostalCodeNotFoundError } from './errors/postal-code-not-found-error';
import { FindLocalByPostalCodeService } from './find-locate-by-postal-code-service';

let findLocalByPostalCodeService: FindLocalByPostalCodeService;

describe('Find Local By Postal Code Service', () => {
  it('should be able to find local by postal code', async () => {
    findLocalByPostalCodeService = new FindLocalByPostalCodeService();

    const postalCode = '01001000';

    const locate = await findLocalByPostalCodeService.execute({
      postalCode,
    });

    expect(locate.cep).toEqual('01001-000');
    expect(locate.localidade).toEqual('São Paulo');
  });

  it('should be not able to find local if postal code not found', async () => {
    findLocalByPostalCodeService = new FindLocalByPostalCodeService();

    const invalidPostalCodeOne = '1234567';
    const invalidPostalCodeTwo = 'ABCDEFGH';

    expect(async () => {
      await findLocalByPostalCodeService.execute({
        postalCode: invalidPostalCodeOne,
      });
    }).rejects.toBeInstanceOf(InvalidPostalCodeError);

    expect(async () => {
      await findLocalByPostalCodeService.execute({
        postalCode: invalidPostalCodeTwo,
      });
    }).rejects.toBeInstanceOf(InvalidPostalCodeError);
  });

  it('should be not able to find local if postal code not found', async () => {
    findLocalByPostalCodeService = new FindLocalByPostalCodeService();

    const postalCode = '00000000';

    expect(async () => {
      await findLocalByPostalCodeService.execute({
        postalCode,
      });
    }).rejects.toBeInstanceOf(PostalCodeNotFoundError);
  });
});
