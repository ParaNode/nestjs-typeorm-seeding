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

### Installation

```bash
npm install @paranode/nestjs-typeorm-seeding
```

import `TypeormSeedingModule` into your root module

```typescript
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { TypeormSeedingModule } from '@paranode/nestjs-typeorm-seeding';

@Module({
  imports: [
    TypeOrmModule.forRoot({...}),
    TypeormSeedingModule.registerAsync({
      useFactory: (datasource: DataSource) => ({
        seeds: ['src/database/seeds/**/*.{ts,js}'],
        datasource
      }),
      inject: [getDataSourceToken()],
      imports: [TypeOrmModule.forFeature()]
    })
  ]
})
export class AppModule{}
```

## Contributing

Contributions welcome! open a PR [here](https://github.com/ParaNode/nestjs-typeorm-seeding/pulls).

## Author

**Sayed Mahmoud [Github](https://github.com/sayedmahmoud266)**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.