import { City, State } from '@prisma/client';

import { CitiesRepository } from '../cities-repository';

export class InMemoryCitiesRepository implements CitiesRepository {
  public cities: City[] = [];

  public states: State[] = [];

  async findByCityNameAndStateAbbreviation(
    cityName: string,
    stateAbbreviation: string,
  ) {
    const city = this.cities.find(
      (city) =>
        city.name === cityName &&
        this.states.find(
          (state) =>
            state.abbreviation === stateAbbreviation &&
            state.id === city.state_id,
        ),
    );

    return city || null;
  }
}
