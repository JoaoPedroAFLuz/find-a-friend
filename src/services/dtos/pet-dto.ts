export interface PetInputDTO {
  orgId: string;
  name: string;
  about: string;
  age: 'PUPPY' | 'ADULT';
  port: 'SMALL' | 'MEDIUM' | 'LARGE';
  energyLevel: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  independenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  environment: 'SMALL' | 'MEDIUM' | 'LARGE';
  photos: string[];
  adoptionRequirements: string[];
}
