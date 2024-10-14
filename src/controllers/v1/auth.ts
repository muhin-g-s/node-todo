import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AuthMiddleware } from '../middleware/auth';
import { UseCaseAuth } from '../../domain/use-cases/user';

export const prefixAuth = '/auth';

export class AuthHandler {
	constructor(private authMiddleware: AuthMiddleware, private useCaseAuth: UseCaseAuth) {
	}

	async registerRoutes(instance: FastifyInstance, options: FastifyPluginOptions) {
		instance.post('/register', async (request, reply) => {
			return reply.code(200).send({ msg: 'register' })
		})
	
		instance.post('/login', async (request, reply) => {
			return reply.code(200).send({ msg: 'login' })
		})
	}
}