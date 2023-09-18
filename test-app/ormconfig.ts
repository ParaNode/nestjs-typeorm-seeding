export default [
  {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'typeorm-seeding-test',
    username: 'postgres',
    password: 'postgres',
    entities: ['sample/entities/**/*{.ts,.js}'],
    factories: ['sample/factories/**/*{.ts,.js}'],
    seeds: ['sample/seeds/**/*{.ts,.js}'],
    cli: {
      seedsDir: 'src/database/seeds',
    },
  },
];
