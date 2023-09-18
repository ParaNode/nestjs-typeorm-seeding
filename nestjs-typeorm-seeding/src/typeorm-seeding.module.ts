import { DynamicModule, Module } from '@nestjs/common';
import { TypeormSeedingModuleOptions } from './typeorm-seeding-options';
import { TypeormSeedingRunnerService } from './typeorm-seeding-runner.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature()]
})
export class TypeormSeedingModule {
  static registerAsync(options: TypeormSeedingModuleOptions): DynamicModule {
    const {useClass, useExisting, useFactory, inject, imports} = options;
    return {
      module: TypeormSeedingModule,
      providers: [
        {
          provide: 'typeorm_seeding_options',
          useClass,
          useExisting,
          useFactory,
          inject,
        },
        TypeormSeedingRunnerService,
      ],
      imports
    };
  }
}
