import axios from 'axios';

import { isAValidPostalCode } from '@/utils/is-a-valid-postal-code';
import { InvalidPostalCodeError } from './errors/invalid-postal-code-error';
import { ResourceNotFound } from './errors/resource-not-found-error';

interface FindLocationByPostalCodeServiceRequest {
  postalCode: string;
}

interface FindLocationByPostalCodeServiceResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export class FindLocationByPostalCodeService {
  constructor() {}

  async execute({
    postalCode,
  }: FindLocationByPostalCodeServiceRequest): Promise<FindLocationByPostalCodeServiceResponse> {
    if (!isAValidPostalCode(postalCode)) {
      throw new InvalidPostalCodeError();
    }

    const { data } = await axios.get(
      `https://viacep.com.br/ws/${postalCode}/json`,
    );

    if (data.erro) {
      throw new ResourceNotFound('Location code not found');
    }

    return data;
  }
}
