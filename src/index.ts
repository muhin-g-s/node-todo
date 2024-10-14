import { UserService } from './domain/services/user/user-service.js';
import Fastify, { FastifyInstance } from 'fastify'
import {prefixAuth, AuthHandler} from './controllers/v1/auth.js';
import { AuthManager } from './pkg/auth-manager/index.js';
import { AuthMiddleware } from './controllers/middleware/auth.js';
import { additionalKeyUserId } from './controllers/types.js';
import { UseCaseAuth } from './domain/use-cases/user/index.js';
import { UserRepository } from './repository/typed-orm/user/index.js';
import { sqliteClient } from './pkg/db-client/index.js';
import "reflect-metadata"

const server: FastifyInstance = Fastify()
server.decorateRequest(additionalKeyUserId, '')
const globalPrefix = 'api/v1';

const authManager = new AuthManager();
const authMiddleware =  new AuthMiddleware(authManager);

const db = await sqliteClient.initialize();

const userRepository = new UserRepository(db.manager);
const userService = new UserService(userRepository);
const useCaseAuth = new UseCaseAuth(authManager, userService);
const authHandler = new AuthHandler(authMiddleware, useCaseAuth);
authMiddleware.addRequestUserId(server);
server.register(authHandler.registerRoutes, {prefix: globalPrefix + prefixAuth});


server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server at ${address}`)
})