import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as express from 'express';
import * as path from 'path';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.use(
    session({
      secret: process.env.SECRET_SESSION_KEY,
      resave: Boolean(process.env.SESSION_RESAVE),
      saveUninitialized: Boolean(process.env.SESSION_SAVE_UNINITIALIZED),
    }),
  );
  await app.use(passport.initialize());
  await app.use(passport.session())
  await app.listen(process.env.PORT);
}
bootstrap();
