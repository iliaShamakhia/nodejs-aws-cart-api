import { NestFactory } from '@nestjs/core';

//import helmet from 'helmet';

import { AppModule } from './app.module';
//import { ConfigService } from '@nestjs/config';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* const configService = app.get(ConfigService);

  const port = configService.get('APP_PORT') || 4000; */
  app.enableCors({
    origin: true,
  });
  //app.use(helmet());
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });

  /* await app.listen(port, () => {
    console.log('App is running on %s port', port);
  }); */
}
//bootstrap();

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
