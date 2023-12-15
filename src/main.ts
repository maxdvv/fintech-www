import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as redis from 'redis';
import * as Store from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import * as express from 'express';
import * as path from 'path';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import * as process from "process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const RedisStore = Store(session);
  const redisClient = redis.createClient({
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT)
  });
  redisClient.on('error', (err) =>
    Logger.error('Could not establish a connection with redis. ' + err)
  );
  redisClient.on('connect', () =>
    Logger.verbose('Connected to redis successfully')
  );

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(express.static(path.join(__dirname, '../client/src', 'index.html')));

  const config = new DocumentBuilder()
    .setTitle('Fintech-www')
    .setDescription('The fintech-www API description')
    .setVersion('1.0')
    .addTag('fintech-www')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SECRET_SESSION_KEY,
      resave: Boolean(process.env.SESSION_RESAVE),
      saveUninitialized: Boolean(process.env.SESSION_SAVE_UNINITIALIZED)
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT);
}
bootstrap();
