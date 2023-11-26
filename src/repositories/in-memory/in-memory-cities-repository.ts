import { City, State } from '@prisma/client';

import { CitiesRepository } from '../cities-repository';

export class InMemoryCitiesRepository implements CitiesRepository {
  states: State[] = [
    {
      id: '591836a4-8c91-11ee-b9d1-0242ac120002',
      name: 'São Paulo',
      abbreviation: 'SP',
    },
  ];
  cities: City[] = [
    {
      id: '591838fc-8c91-11ee-b9d1-0242ac120002',
      state_id: '591836a4-8c91-11ee-b9d1-0242ac120002',
      name: 'São Paulo',
    },
  ];

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
