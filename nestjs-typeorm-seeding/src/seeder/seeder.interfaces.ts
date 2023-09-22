import { DataSource } from "typeorm";

export interface ISeeder {
  run(datasource: DataSource, factory): Promise<void>;
}
