import { Faker } from "@faker-js/faker";

export interface IFactory<T> {
  generate(faker: Faker): T;
}