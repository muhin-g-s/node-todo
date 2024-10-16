import { UserService } from './domain/services/user/user-service';
import Fastify, { FastifyInstance } from 'fastify'
import {prefixAuth, AuthHandler} from './controllers/v1/auth';
import { AuthManager } from './pkg/auth-manager/index';
import { UseCaseAuth } from './domain/use-cases/user/index';
import { UserRepository } from './repository/typed-orm/user/index';
import { sqliteClient } from './pkg/db-client/index';
import "reflect-metadata"
import { AuthMiddleware } from './controllers/middleware/auth';

const server: FastifyInstance = Fastify()
const globalPrefix = 'api/v1';

const authManager = new AuthManager();
const authMiddleware =  new AuthMiddleware(authManager);
authMiddleware.addRequestUserId(server);

try {

(async () => {
    const db = await sqliteClient.initialize();
    const userRepository = new UserRepository(db.manager);
    const userService = new UserService(userRepository);
    const useCaseAuth = new UseCaseAuth(authManager, userService);
    const authHandler = new AuthHandler(useCaseAuth);
    await server.register(authHandler.registerRoutes, { prefix: globalPrefix + prefixAuth });
    const port = await server.listen({ port: 8080 });
    console.log(`Server at 8080 ${port}`);
})();
} catch (err) {
	console.error(err);
	process.exit(1);
}