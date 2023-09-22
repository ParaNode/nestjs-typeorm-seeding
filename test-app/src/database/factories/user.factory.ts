import { IFactory, EntityFactory } from '@paranode/nestjs-typeorm-seeding';
import { Faker } from '@faker-js/faker';
import { User } from 'src/user/entities/user.entity';

@EntityFactory(User)
export class UserFactory implements IFactory<User> {

  generate(faker: Faker): User {
    const u = new User();
    u.email = faker.internet.email();
    u.name = faker.person.fullName();
    u.password = faker.internet.password();
    return u;
  }
}