import { ModuleMetadata, Type } from "@nestjs/common";
import { DataSource } from "typeorm";

export interface TypeormSeedingOptions {
  seeds: string[];
  factories?: string[];
  seedsTableName?: string;
  datasource?: DataSource
}

export interface TypeormSeedingModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<TypeormSeedingOptions>;
  useClass?: Type<TypeormSeedingOptions>;
  useFactory?: (...args: any[]) => Promise<TypeormSeedingOptions> | TypeormSeedingOptions;
  inject?: any[];
}