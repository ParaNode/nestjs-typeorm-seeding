import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
  Type,
} from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, Table } from 'typeorm';
import { ISeeder } from './seeder.interfaces';
import { FactoryService } from '../factory';
import { ISeederModuleConfig } from '../config.interface';

interface LoggedSeeder {
  name: string;
  run_at: Date;
}

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  @Inject(getDataSourceToken())
  private readonly datasource: DataSource;

  @Inject()
  private readonly factoryService: FactoryService;

  @Inject('seeder:config')
  private readonly config: ISeederModuleConfig;

  private readonly logger = new Logger(this.constructor.name);
  private readonly seederRegistery = new Map<string, Type<ISeeder>>();

  private get seederTableName() {
    return this.config.seederTableName ?? 'typeorm_seeders';
  }

  async onApplicationBootstrap() {
    await this.confirmSeedersTable();
    await this.executeSeeders();
  }

  registerSeeders(seeders: Array<Type<ISeeder>>) {
    for (const s of seeders) {
      this.seederRegistery.set(s.name, s);
    }
  }

  private async executeSeeders() {
    const seedersArr = await this.getAlreadyRanSeeders();
    const alreadyRanSeeders = this.convertToTruthyMap(seedersArr, 'name');
    const ranSeedersRefArr = [];
    const toRunSeederRefArr = [];
    for (const seederName of this.seederRegistery.keys()) {
      if (alreadyRanSeeders.get(seederName)) {
        ranSeedersRefArr.push(seederName);
      } else {
        toRunSeederRefArr.push(this.seederRegistery.get(seederName));
      }
    }

    this.logger.log(
      `Seeders Loaded. ${ranSeedersRefArr.length} seeders already ran, ${toRunSeederRefArr.length} seeders are ready to be executed`,
    );

    for (const seederClass of toRunSeederRefArr) {
      const seederInst = new seederClass();
      await this.runSeeder(seederInst);
    }

    if (toRunSeederRefArr && toRunSeederRefArr.length) {
      this.logger.log('🎉 finished executing all seeders 🎉');
    }
  }

  private async runSeeder(seeder: ISeeder) {
    this.logger.log(`running seeder [${seeder.constructor.name}] ...`);
    await seeder.run(this.datasource, this.factoryService.getFactory());
    await this.logSeederNameToDatabase(seeder);
  }

  private async confirmSeedersTable() {
    const table = new Table({
      name: this.seederTableName,
      columns: [
        {
          name: 'name',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'run_ar',
          type: 'timestamp',
          default: 'now()',
          isNullable: false,
        },
      ],
    });

    await this.datasource.createQueryRunner().createTable(table, true);
  }

  private async logSeederNameToDatabase(seeder: ISeeder) {
    await this.datasource.query(
      `insert into "${this.seederTableName}" ("name") values ('${seeder.constructor.name}')`,
    );
  }

  private async getAlreadyRanSeeders() {
    const seeders: Array<LoggedSeeder> = await this.datasource.query(
      `select * from "${this.seederTableName}"`,
    );

    return seeders;
  }

  private convertToTruthyMap<T = any>(array: Array<T>, prop: keyof T) {
    const map = new Map<string, boolean>();
    for (const i of array) {
      map.set(i[prop as any], true);
    }

    return map;
  }
}
