import { City } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { CitiesRepository } from '../cities-repository';

export class PrismaCitiesRepository implements CitiesRepository {
  async findByCityNameAndStateAbbreviation(
    cityName: string,
    stateAbbreviation: string,
  ): Promise<City | null> {
    return prisma.city.findFirst({
      where: {
        name: cityName,
        state: {
          abbreviation: stateAbbreviation,
        },
      },
    });
  }
}
