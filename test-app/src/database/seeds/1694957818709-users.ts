/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-default-export */
import type { Factory, Seeder } from '@paranode/typeorm-seeding';
import type { DataSource } from 'typeorm';

export default class Users1694957818709 implements Seeder {
  public async run(_factory: Factory, _connection: DataSource): Promise<any> {
    // add your logic here
    const queryRunner = _connection.createQueryRunner();

    const r = await queryRunner.query(`select 'Hello' as world`);

    console.log(r);
  }
}