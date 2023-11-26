import axios from 'axios';

import { PostalCodeNotFoundError } from '@/services/errors/postal-code-not-found-error';

interface FindLocalByPostalCodeServiceRequest {
  postalCode: string;
}

interface FindLocalByPostalCodeServiceResponse {
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

export class FindLocalByPostalCodeService {
  async execute({
    postalCode,
  }: FindLocalByPostalCodeServiceRequest): Promise<FindLocalByPostalCodeServiceResponse> {
    const { data } = await axios.get(
      `https://viacep.com.br/ws/${postalCode}/json`,
    );

    if (data.erro) {
      throw new PostalCodeNotFoundError();
    }

    return data;
  }
}
