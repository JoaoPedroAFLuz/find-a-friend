import {
  AgeEnum,
  EnergyLevelEnum,
  EnvironmentEnum,
  IndependenceLevelEnum,
  PortEnum,
} from '@prisma/client';
import { OrgDTO } from './org-dto';

export interface PetInputDTO {
  orgId: string;
  name: string;
  about: string;
  age: AgeEnum;
  port: PortEnum;
  energyLevel: EnergyLevelEnum;
  independenceLevel: IndependenceLevelEnum;
  environment: EnvironmentEnum;
  photos: string[];
  adoptionRequirements: string[];
}

export interface PetDTO {
  id: string;
  org: OrgDTO;
  name: string;
  about: string;
  age: AgeEnum;
  port: PortEnum;
  energyLevel: EnergyLevelEnum;
  independenceLevel: IndependenceLevelEnum;
  environment: EnvironmentEnum;
  photos: string[];
  adoptionRequirements: string[];
  createdAt: Date;
}
