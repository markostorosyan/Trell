import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  logging: configService.get<boolean>('DB_LOGGING'),
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  synchronize: false,
});
