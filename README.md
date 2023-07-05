# Express + TypeScript Starter

This starter project provides a solid foundation for building web applications using Express and TypeScript. It includes several features and technologies to help you get up and running quickly.

## Features

- Express: Handles REST API endpoints and routing.
- Websocket: Enables real-time communication.
- MongoDB: Serves as the database provider.
- Dependency Injection: Utilizes [TypeDI](https://github.com/typestack/typedi) for managing dependencies.
- JWT: Provides authentication capabilities using JSON Web Tokens.
- Basic User Management: Includes functionality for user registration, login, and logout.
- Docker: Offers containerization support for running the project.

Table of Contents:

- [Getting Started](#getting-started)
  - [Development](#development)
  - [Production](#production)
    - [Manual Deployment](#manual-deployment)
    - [Using Docker](#using-docker)
- [Usage](#usage)
  - [REST API](#rest-api)
  - [Dependency Injection](#dependency-injection)
  - [Using MongoDB with Mongoose](#using-mongodb-with-mongoose)
  - [Websocket](#websocket)

## Getting Started

### Development

To begin development, follow these steps:

1. Clone the repository.
2. Install the project dependencies by running either `npm install` or `yarn install`.
3. Rename the `.env.example` file to `.env` and fill in the values.
4. Start the server by running `npm run dev`.

### Production

#### Manual Deployment

For manual deployment, use the following steps:

1. Build the project by running `npm run build`.
2. Start the server by running `npm start`.

#### Using Docker

Build the image:

```bash
docker build -t express-typescript-starter .
```

Run the container:

```bash
docker run -p 3000:3000
  -e PORT=3000
  -e MONGO_URL=mongodb://localhost:27017/databaseName express-typescript-starter
  -e JWT_SECRET=secret
  -e WS_ENABLED=true
```

## Usage

### REST API

Create a new controller in `src/controllers` with the following naming convention: `<name>.controller.ts`.
It stands for the name of the resource you want to create (e.g. `user.controller.ts`).

Then you can create routes for the resource in the controller using the `Route` decorator:

```typescript
import { Request, Response } from 'express';

import { Route } from '../decorators/routes.decorator.js';

export class HomeController {
  @Route({ path: '/', method: 'GET' })
  async index(req: Request, res: Response) {
    res.status(200).json({ message: 'Hello world' });
  }
}
```

The `Route` decorator takes an object with the following properties:

```typescript
{
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  middlewares?: any[];
}
```

Middlewares are optional and can be used to handle authentication, validation, etc.
For example, to handle authentication, you can use the `AuthMiddleware`:

```typescript
@Route({
  path: '/user',
  method: 'GET',
  middlewares: [AuthMiddleware],
})
async getUser(req: Request & { userId?: string }, res: Response) {
  // your code here
}
```

The `AuthMiddleware` will check if the user is authenticated and if so, it will add the `userId` to the request object.

Same goes for validation. You can create a validation middleware and use it in the controller:

```typescript
@Route({
  path: '/user',
  method: 'POST',
  middlewares: [ValidateMiddleware],
})
async createUser(req: Request, res: Response) {
  // your code here
}
```

For more information about middlewares, check out the [express documentation](https://expressjs.com/en/guide/using-middleware.html).

### Dependency Injection

Create a new service in `src/services` with the following naming convention: `<name>.service.ts`. And add `@Service()` decorator to the class:

```typescript
import { Service } from 'typedi';

@Service()
export class UserService {
  // your code here
}
```

Then you can inject the service in the controller using the `Inject` decorator:

```typescript
import { Request, Response } from 'express';

import { Route } from '../decorators/routes.decorator.js';
import { UserService } from '../services/user.service.js';

export class UserController {
  constructor(@Inject() private userService: UserService) {} // inject the service here

  @Route({ path: '/user', method: 'GET' })
  async getUser(req: Request, res: Response) {
    // your code here
    this.userService.getUser();
  }
}
```

### Using MongoDB with Mongoose

To use MongoDB, you need to create a new model in `src/models` with the following naming convention: `<name>.model.ts`.
Later, you can use the model in the service or controller:

```typescript
import { Service } from 'typedi';
import { UserModel } from '../models/user.model.js';

@Service()
export class UserService {
  async getUser() {
    const user = await userModel.findOne({ name: 'John' });
  }
}
```

### Websocket

The websocket feature is optional, and you can disable it by setting `WS_ENABLED` to `false` in the `.env` file. By default, it upgrades the http server to a websocket server and listens on the same port. Both the HTTP and websocket servers are available simultaneously.

## License

[MIT](LICENSE)
