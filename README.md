# Nicasource Assignment

## Limitations and Scope

<p style="text-align: justify">The coding assignment involves developing a backend project using NestJS. Certain limitations need to be acknowledged. Notably, no pagination feature has been developed as it wasn't explicitly specified in the requirements. Additionally, to adhere to security best practices, some errors are intentionally kept non-verbose. For instance, during login, a generic HTTP code is returned instead of a specific 404 status when an email doesn't exist. This cautious approach helps in minimizing potential information leakage while maintaining the project's security integrity.</p>

## Database Design

<img alt="database diagram" src="db_diagram.png">

## Envs

<p>Proceed to create a .env file withe the following values in the root directory</p>

```bash
PORT=8080
JWT_SECRET=secret
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=videos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/videos?schema=public"
```

## Installation

```bash
$ npm install
```

## Running the database

```bash
# run postgres
$ docker compose up -d

# apply migrations and seed
$ npx prisma migrate dev 
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# build
$ npm run build

# production mode
$ npm run start:prod
```

## Documentation

<p>Head over to for the Swagger documentation once you've started the backend:</p>

<a href="http://localhost:8080/api">Swagger</a>

## Stay in touch

- Author - [Mauricio Matamoros](https://github.com/MauriMatamoros)
