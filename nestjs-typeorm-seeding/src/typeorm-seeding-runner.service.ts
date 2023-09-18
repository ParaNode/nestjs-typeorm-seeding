import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { TypeormSeedingOptions } from './typeorm-seeding-options';
import {
  loadFiles,
  importFiles,
} from '@paranode/typeorm-seeding/utils/file.util';
import { importSeed } from '@paranode/typeorm-seeding';
import { DataSource, ObjectType, Table } from 'typeorm';
import { Factory, Seeder, SeederConstructor } from '@paranode/typeorm-seeding/types';
import { getNameOfEntity } from '@paranode/typeorm-seeding/utils/factory.util';
import { EntityFactory } from '@paranode/typeorm-seeding/entity-factory';
require('ts-node').register();

@Injectable()
export class TypeormSeedingRunnerService implements OnApplicationBootstrap {
  @Inject('typeorm_seeding_options')
  private seedingOptions: TypeormSeedingOptions;

  get datasource(): DataSource {
    return this.seedingOptions.datasource
  }

  private logger = new Logger(this.constructor.name);

  private get seedsTableName() {
    return this.seedingOptions.seedsTableName || 'typeorm_seeds';
  }

  async onApplicationBootstrap() {
    await this.loadFactories();
    const seeders = await this.loadSeeders();
    await this.createSeedTable();
    await this.prepareAndExecuteSeeds(seeders);
  }

  private async loadFactories() {
    if (this.seedingOptions.factories) {
      this.logger.log('Loading Factories...');
      const factoryFiles = await loadFiles(this.seedingOptions.factories);
      try {
        await importFiles(factoryFiles);
      } catch (error) {
        this.logger.error('Could not load factories', error.stack);
        throw error;
      }
    }
  }

  private async loadSeeders() {
    this.logger.log('Loading Seeders...');
    const seedFiles = loadFiles(this.seedingOptions.seeds);
    let seedFileObjects = [];

    try {
      seedFileObjects = await Promise.all(
        seedFiles.map((seedFile) => importSeed(seedFile)),
      );
      return seedFileObjects;
    } catch (error) {
      throw error;
    }
  }

  private async createSeedTable() {
    const seedsTable = new Table({
      name: this.seedsTableName,
      columns: [
        {
          name: 'className',
          type: 'varchar',
          isUnique: true,
          isNullable: true,
        },
        {
          name: 'ran_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    });

    await this.datasource.createQueryRunner().createTable(seedsTable, true);
  }

  private async getExecutedSeeds() {
    const executedSeeds: Array<{ className: string; ran_at: Date }> =
      await this.datasource.query(`select * from "${this.seedsTableName}"`);
    return executedSeeds;
  }

  private async prepareAndExecuteSeeds(seedFileObjects: any[]) {
    const seedsAlreadyRan = await this.getExecutedSeeds();

    const seedRanNames = seedsAlreadyRan.map((sar) => sar.className);
    seedFileObjects = seedFileObjects.map((sfo) =>
      sfo?.default ? sfo.default : sfo,
    );
    seedFileObjects = seedFileObjects.filter(
      (sfo) => !seedRanNames.includes(sfo.name),
    );

    this.logger.log(
      `Finished preparing seeders. ${seedsAlreadyRan.length} seeders already ran, ${seedFileObjects.length} seeders are ready to be executed`,
    );

    this.datasource.transaction(async (em) => {
      for (const seedFileObject of seedFileObjects) {
        try {
          await this.runSeeder(seedFileObject, em.connection);
          await this.logToSeedTable(seedFileObject.name, em.connection);
          this.logger.log(`Seeder ${seedFileObject.name} Executed successfully`);
        } catch (error) {
          this.logger.error(`error executing seeder ${seedFileObject.name}!`, error.stack)
          throw error;
        }
      }
    });
  }

  private async runSeeder(clazz: SeederConstructor, connection: DataSource) {
    const seeder: Seeder = new clazz();
    return seeder.run(this.getFactory(),connection);
  }

  private async logToSeedTable(seederName: string, ds: DataSource) {
    return ds.query(`insert into "${this.seedsTableName || 'typeorm_seeds'}" values ('${seederName}')`)
  }

  private getFactory<Entity,Context>(): Factory {
    const factory: Factory = <Entity, Context>(entity: ObjectType<Entity>) => (context?: Context) => {
      const name = getNameOfEntity(entity)
      const entityFactoryObject = (global as any).seeder.entityFactories.get(name)
      return new EntityFactory<Entity, Context>(name, entity, entityFactoryObject.factory, context)
    }

    return factory
  }

}
