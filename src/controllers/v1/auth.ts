import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { UseCaseAuth } from '../../domain/use-cases/user';
import { UserEntity } from '../../domain/entities/user';

export const prefixAuth = '/auth';

export class AuthHandler {
	constructor(private useCaseAuth: UseCaseAuth) {
	}

	registerRoutes = async (instance: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
		instance.post('/register', async (request, reply) => {
			const requestData = JSON.parse(request.body as string) as UserEntity;

			if(!requestData.password) {
				return reply.code(401).send({ error: 'password' })
			}

			if(!requestData.username) {
				return reply.code(401).send({ error: 'username' })
			}

			const user = await this.useCaseAuth.register(requestData);

			const { password, ...userWithoutPassword } = user;

			const response = {
				msg: 'register',
				...userWithoutPassword,
			}
			return reply.code(200).send(response);
		})

		instance.post('/login', async (request, reply) => {
			const requestData = JSON.parse(request.body as string) as UserEntity;

			if(!requestData.password) {
				return reply.code(401).send({ error: 'password' })
			}

			if(!requestData.username) {
				return reply.code(401).send({ error: 'username' })
			}

			const {token, userId} = await this.useCaseAuth.login(requestData);

			const response = {
				msg: 'login',
				userId
			}
			return reply.code(200).header('authorization', token).send(response);
		})
	}
}