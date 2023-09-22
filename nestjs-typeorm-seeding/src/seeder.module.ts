import { DynamicModule, Module } from "@nestjs/common";
import { FactoryService } from "./factory/factory.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ISeederModuleConfig } from "./config.interface";
import { SeederService } from "./seeder/seeder.service";


@Module({})
export class SeederModule {
  static register(options: ISeederModuleConfig): DynamicModule {
    return {
      module: SeederModule,
      imports: [TypeOrmModule],
      providers: [
        FactoryService,
        SeederService,
        {
          provide: 'seeder:config',
          useValue: options,
        },
        {
          provide: 'seeder:initialize',
          useFactory: (seederService: SeederService, factoryService: FactoryService) => {
            if (options.factories && options.factories.length) {
              factoryService.registerFactories(options.factories);
            }
            
            if (options.seeders && options.seeders.length) {
              seederService.registerSeeders(options.seeders);
            }

            return {
              initialized: true,
            };
          },
          inject: [SeederService, FactoryService]
        }
      ],
    }
  }
}