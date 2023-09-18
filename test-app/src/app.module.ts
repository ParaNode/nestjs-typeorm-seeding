import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { TypeormSeedingModule } from '@paranode/nestjs-typeorm-seeding';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'typeorm-seeding-test',
      username: 'postgres',
      password: 'postgres',
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    TypeormSeedingModule.registerAsync({
      useFactory: (datasource: DataSource) => ({
        seeds: ['src/database/seeds/**/*{.ts,.js}'],
        datasource
      }),
      inject: [getDataSourceToken()],
      imports: [TypeOrmModule.forFeature()]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
