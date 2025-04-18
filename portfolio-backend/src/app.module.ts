import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { EmailsModule } from './emails/emails.module';
import configuration from './config/configuration';

const NODE_ENV = process.env.NODE_ENV;
const envPath = path.resolve(
  process.cwd(),
  !NODE_ENV ? '.env' : `.env.${NODE_ENV}`,
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: envPath,
      cache: true,
    }),
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
