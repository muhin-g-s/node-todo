import { createResponseErrorInternal, createResponseBadRequest, createResponseNotFound } from './controllers/http/response/error';
import "reflect-metadata"

import { TaskHandler, prefixTask } from './controllers/http/v1/task';
import { prefixAuth, AuthHandler } from './controllers/http/v1/auth';
import { AuthMiddleware } from './controllers/http/middleware/auth';
import { prefixUser, UserHandler } from './controllers/http/v1/user';
import { UseCaseTask } from './domain/use-cases/task';
import { TaskService } from './domain/services/task/';
import { TaskRepository } from './repository/typed-orm/task/task-repository';
import { UserService } from './domain/services/user';
import Fastify, { FastifyInstance } from 'fastify'
import { AuthManager } from './pkg/auth-manager/index';
import { UseCaseUser } from './domain/use-cases/user';
import { UseCaseAuth } from './domain/use-cases/auth';
import { UserRepository } from './repository/typed-orm/user/index';
import { sqliteClient } from './pkg/db-client/index';
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError, jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { AuthService } from './domain/services/auth';
import { PasswordService } from './domain/services/password';

const globalPrefix = 'api/v1' as const;


try {
	(async () => {

		const db = await sqliteClient.initialize();
		const userRepository = new UserRepository(db.manager);
		const taskRepository = new TaskRepository(db.manager);

		const authManager = new AuthManager();

		const passwordService = new PasswordService();
		const userService = new UserService(userRepository, passwordService);
		const taskService = new TaskService(taskRepository);
		const authService = new AuthService(userRepository, authManager);

		const useCaseAuth = new UseCaseAuth(authService, userService);
		const useCaseUser = new UseCaseUser(userService);
		const useCaseTask = new UseCaseTask(taskService);

		const authMiddleware = new AuthMiddleware(authManager);
		const authHandler = new AuthHandler(useCaseAuth);
		const userHandler = new UserHandler(useCaseUser, authMiddleware);
		const taskHandler = new TaskHandler(useCaseTask, authMiddleware);

		const server: FastifyInstance = Fastify();
		authMiddleware.addRequestUserId(server);

		server.setValidatorCompiler(validatorCompiler);
		server.setSerializerCompiler(serializerCompiler);

		server.setErrorHandler((err, req, reply) => {
			if (hasZodFastifySchemaValidationErrors(err)) {
				return createResponseBadRequest(req, reply);
			}

			if (isResponseSerializationError(err)) {
				return createResponseErrorInternal(req, reply);
			}
		})

		server.setNotFoundHandler(createResponseNotFound);

		server.register(fastifySwagger, {
			openapi: {
				info: {
					title: 'node todo',
					version: '1.0.0',
				},
				servers: [],
				components: {
					securitySchemes: {
						apiKey: {
							type: 'apiKey',
							name: 'authorization',
							in: 'header'
						}
					}
				},
			},
			transform: jsonSchemaTransform,

		});

		server.register(fastifySwaggerUi, {
			routePrefix: '/doc',
		});

		await server.register(authHandler.registerRoutes, { prefix: globalPrefix + prefixAuth });
		await server.register(userHandler.registerRoutes, { prefix: globalPrefix + prefixUser });
		await server.register(taskHandler.registerRoutes, { prefix: globalPrefix + prefixTask });

		const port = await server.listen({ port: 8080 });
		console.log(`Server at 8080 ${port}/doc`);
	})();
} catch (err) {
	console.error(err);
	process.exit(1);
}