export enum PetAge {
  PUPPY = 'PUPPY',
  ADULT = 'ADULT',
}

export enum PetPort {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum PetEnergyLevel {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

export enum PetIndependenceLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum PetEnvironment {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export interface PetInputDTO {
  orgId: string;
  name: string;
  about: string;
  age: PetAge;
  port: PetPort;
  energyLevel: PetEnergyLevel;
  independenceLevel: PetIndependenceLevel;
  environment: PetEnvironment;
  photos: string[];
  adoptionRequirements: string[];
}
