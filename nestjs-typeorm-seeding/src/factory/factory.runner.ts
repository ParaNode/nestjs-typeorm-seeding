import { faker } from '@faker-js/faker'
import { DataSource, ObjectType, SaveOptions } from 'typeorm'
import { FactoryFunction, EntityProperty } from './factory.types'
import { isPromiseLike } from './factory.utils'
import { Logger } from '@nestjs/common'

export class FactoryRunner<Entity, Context> {
  private logger = new Logger(this.constructor.name);
  private mapFunction: (entity: Entity) => Promise<Entity>

  constructor(
    public name: string,
    public entity: ObjectType<Entity>,
    private datasource: DataSource,
    private factory: FactoryFunction<Entity, Context>,
    private context?: Context,
  ) {}

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * This function is used to alter the generated values of entity, before it
   * is persist into the database
   */
  public map(mapFunction: (entity: Entity) => Promise<Entity>): FactoryRunner<Entity, Context> {
    this.mapFunction = mapFunction
    return this
  }

  /**
   * Make a new entity, but does not persist it
   */
  public async make(overrideParams: EntityProperty<Entity> = {}): Promise<Entity> {
    return this.makeEnity(overrideParams, false)
  }

  /**
   * Create makes a new entity and does persist it
   */
  public async create(overrideParams: EntityProperty<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity> {
    if (this.datasource && this.datasource.isInitialized) {
      const em = this.datasource.createEntityManager()
      try {
        const entity = await this.makeEnity(overrideParams, true)
        return await em.save<Entity>(entity, saveOptions)
      } catch (error) {
        const message = 'Could not save entity'
        this.logger.error(message, error)
        throw new Error(message)
      }
    } else {
      const message = 'No db connection is given'
      this.logger.error(message)
      throw new Error(message)
    }
  }

  public async makeMany(amount: number, overrideParams: EntityProperty<Entity> = {}): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.make(overrideParams)
    }
    return list
  }

  public async createMany(
    amount: number,
    overrideParams: EntityProperty<Entity> = {},
    saveOptions?: SaveOptions,
  ): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.create(overrideParams, saveOptions)
    }
    return list
  }


  // -------------------------------------------------------------------------
  // Private Helpers
  // -------------------------------------------------------------------------

  private async makeEnity(overrideParams: EntityProperty<Entity> = {}, isSeeding = false): Promise<Entity> {
    if (!this.factory) {
      throw new Error('Could not found entity')
    }
    let entity = await this.resolveEntity(this.factory(faker, this.context), isSeeding)
    if (this.mapFunction) {
      entity = await this.mapFunction(entity)
    }

    for (const key in overrideParams) {
      if (overrideParams.hasOwnProperty(key)) {
        entity[key] = overrideParams[key] as any
      }
    }

    return entity
  }

  private async resolveEntity(entity: Entity, isSeeding = false): Promise<Entity> {
    for (const attribute in entity) {
      if (!entity.hasOwnProperty(attribute)) {
        continue
      }
      if (isPromiseLike(entity[attribute])) {
        entity[attribute] = await entity[attribute]
      }
      if (
        entity[attribute] &&
        typeof entity[attribute] === 'object' &&
        entity[attribute].constructor.name === FactoryRunner.name
      ) {
        const subEntityFactory = entity[attribute]
        try {
          if (isSeeding) {
            entity[attribute] = await (subEntityFactory as any).create()
          } else {
            entity[attribute] = await (subEntityFactory as any).make()
          }
        } catch (error) {
          const message = `Could not make ${(subEntityFactory as any).name}`
          this.logger.error(message, error)
          throw new Error(message)
        }
      }
    }
    return entity
  }
}
