import { ISeeder, Factory } from '@paranode/nestjs-typeorm-seeding';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';

export class User1695402931466Seed implements ISeeder {

  async run(datasource: DataSource, factory: Factory) {
    const users = await factory(User)().createMany(10);

    await datasource.getRepository(User).save(users)
  }
}