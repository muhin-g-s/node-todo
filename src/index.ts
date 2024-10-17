import "reflect-metadata"

import { UserService } from './domain/services/user/user-service';
import Fastify, { FastifyInstance } from 'fastify'
import {prefixAuth, AuthHandler} from './controllers/v1/auth';
import { AuthManager } from './pkg/auth-manager/index';
import { UseCaseAuth, UseCaseUser } from './domain/use-cases/user/index';
import { UserRepository } from './repository/typed-orm/user/index';
import { sqliteClient } from './pkg/db-client/index';
import { AuthMiddleware } from './controllers/middleware/auth';
import { prefixUser, UserHandler } from './controllers/v1/user';

const globalPrefix = 'api/v1' as const;

try {
	(async () => {

			const db = await sqliteClient.initialize();
			const userRepository = new UserRepository(db.manager);

			const authManager = new AuthManager();

			const userService = new UserService(userRepository);
			
			const useCaseAuth = new UseCaseAuth(authManager, userService);
			const useCaseUser = new UseCaseUser(userService);

			const authMiddleware =  new AuthMiddleware(authManager);
			const authHandler = new AuthHandler(useCaseAuth);
			const userHandler = new UserHandler(useCaseUser, authMiddleware);


			const server: FastifyInstance = Fastify()
			authMiddleware.addRequestUserId(server);
			
			await server.register(authHandler.registerRoutes, { prefix: globalPrefix + prefixAuth });
			await server.register(userHandler.registerRoutes, {prefix: globalPrefix + prefixUser });
			
			const port = await server.listen({ port: 8080 });
			console.log(`Server at 8080 ${port}`);
	})();
} catch (err) {
	console.error(err);
	process.exit(1);
}