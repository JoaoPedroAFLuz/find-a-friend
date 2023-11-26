import { City } from '@prisma/client';

export interface CitiesRepository {
  findByCityNameAndStateAbbreviation(
    cityName: string,
    stateAbbreviation: string,
  ): Promise<City | null>;
}
