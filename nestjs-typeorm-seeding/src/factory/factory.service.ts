import { DataSource, ObjectType } from "typeorm"
import { getNameOfEntity } from "./factory.utils"
import { FactoryRunner } from "./factory.runner"
import { Inject, Injectable, Type } from '@nestjs/common';
import { getDataSourceToken } from "@nestjs/typeorm"
import { Factory } from "./factory.types"
import { IFactory } from "./factory.interfaces";


@Injectable()
export class FactoryService {

  @Inject(getDataSourceToken())
  private readonly datasource: DataSource;

  private readonly factoryRegistery = new Map<string, Type<IFactory<any>>>()

  registerFactories(factories: Array<Type<IFactory<any>>>) {
    for (const f of factories) {
      const entity = Reflect.getMetadata('seeder:entity.factory',f);
      this.factoryRegistery.set(getNameOfEntity(entity), f);
    }
  }

  


  getFactory(): Factory {
    const factory: Factory = <Entity, Context>(entity: ObjectType<Entity>) => (context?: Context) => {
        const name = getNameOfEntity(entity)
        const entityFactoryClass = this.factoryRegistery.get(name);
        const entityFactoryObject = new entityFactoryClass()
        return new FactoryRunner<Entity, Context>(name, entity, this.datasource, entityFactoryObject.generate, context)
      }

    return factory;
  }
}