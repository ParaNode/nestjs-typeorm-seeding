export const EntityFactory = (entity: any): ClassDecorator => {
  return (targetClass) => {
    Reflect.defineMetadata('seeder:entity.factory',entity, targetClass);
  }
}