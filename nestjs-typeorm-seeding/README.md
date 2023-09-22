<h1 align="center"></h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" height="100" width="150" alt="Nest Logo" />
  </a>
  <a href="http://nestjs.com/" target="_blank">
    <img  height="100" src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" width="150" alt="Nest Logo" style="object-fit: contain" />
  </a>
</div>

<h3 align="center">NestJS Typeorm Seeding</h3>

<h4 align="center">

this package works with [@paranode/typeorm-seeding](https://www.npmjs.com/package/@paranode/typeorm-seeding) package
</h4>

# Installation

### 1. install the library using either `npm` or `yarn` or your favourite package manager

```bash
npm install @paranode/nestjs-typeorm-seeding
```

### 2. import `SeedingModule` into your root module or database module

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingModule } from '@paranode/nestjs-typeorm-seeding';

@Module({
  imports: [
    TypeOrmModule.forRoot({...}),
    SeedingModule.register({
      seeders: [],
      factories: [],
    })
  ]
})
export class DatabaseModule{}
```

### _Optional step:_

add these commands to your package.json scripts
```json
{
  ...
  "scripts": {
    ...
    "create:seed": "nest g -c @paranode/nestjs-typeorm-seeding seed",
    "create:factory": "nest g -c @paranode/nestjs-typeorm-seeding factory",
    ...
  }
  ...
}
```

### 3. register your seed files and your factory files to the `SeederModule.register()` function

```typescript
...
SeedingModule.register({
  seeders: [
    // NOTE: seeders will run the orders they're registered in
    UserSeeder,
    RoleSeeder,
  ],
  factories: [
    UserFactory,
    RoleFactory
  ],
})
...
```

# Example app
you can find a full example application on github [here](https://github.com/ParaNode/nestjs-typeorm-seeding/tree/master/test-app)

## Contributing

Contributions welcome! open a PR [here](https://github.com/ParaNode/nestjs-typeorm-seeding/pulls).

## Author

**Sayed Mahmoud [Github](https://github.com/sayedmahmoud266)**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.