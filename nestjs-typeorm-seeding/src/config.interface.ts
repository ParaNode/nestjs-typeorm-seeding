import { Type } from "@nestjs/common";
import { ISeeder } from "./seeder";
import { IFactory } from "./factory";

export interface ISeederModuleConfig {
  seeders?: Array<Type<ISeeder>>;
  factories?: Array<Type<IFactory<any>>>;
  /**
   * @default 'typeorm_seeders'
   */
  seederTableName?: string;
}