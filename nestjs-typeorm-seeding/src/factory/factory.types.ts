import { Faker } from "@faker-js/faker"
import { ObjectType } from "typeorm"
import { FactoryRunner } from "./factory.runner"

/**
 * FactoryFunction is the fucntion, which generate a new filled entity
 */
export type FactoryFunction<Entity, Context> = (faker: Faker, context?: Context) => Entity

/**
 * EntityProperty defines an object whose keys and values must be properties of the given Entity.
 */
export type EntityProperty<Entity> = { [Property in keyof Entity]?: Entity[Property] }

/**
 * Factory gets the EntityFactory to the given Entity and pass the context along
 */
export type Factory = <Entity, Context>(
  entity: ObjectType<Entity>,
) => (context?: Context) => FactoryRunner<Entity, Context>
