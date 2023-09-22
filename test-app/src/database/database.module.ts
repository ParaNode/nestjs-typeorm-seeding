import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeederModule } from "@paranode/nestjs-typeorm-seeding";
import { User1695402931466Seed } from "./seeds/1695402931466-user.seed";
import { UserFactory } from "./factories/user.factory";

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
    SeederModule.register({
      seeders: [
        User1695402931466Seed
      ],
      factories: [
        UserFactory
      ]
    }),
  ]
})
export class DatabaseModule {}