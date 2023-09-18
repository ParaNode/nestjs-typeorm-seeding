import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {

  @InjectDataSource()
  ds: DataSource;
  
  getHello(): string {
    return 'Hello World!';
  }
}
