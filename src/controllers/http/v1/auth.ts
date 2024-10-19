import { Login, Register } from '../dto/request/auth';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { UseCaseAuth } from '@/domain/use-cases/user';

export const prefixAuth = '/auth';

export class AuthHandler {
	constructor(private useCaseAuth: UseCaseAuth) {
	}

	private async registerHandler(request: FastifyRequest, reply: FastifyReply) {
		const userDto = Register.parse(request.body);

		const user = await this.useCaseAuth.register(userDto);

		const { password, ...userWithoutPassword } = user;

		const response = {
			msg: 'register',
			...userWithoutPassword,
		}

		return reply.code(200).send(response);
	}

	private async loginHandler(request: FastifyRequest, reply: FastifyReply) {
		const userDto = Register.parse(request.body);

		const { token, userId } = await this.useCaseAuth.login(userDto);

		const response = {
			msg: 'login',
			userId
		}

		return reply.code(200).header('authorization', token).send(response);
	}

	registerRoutes = async (instance: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
		instance.route({
			method: 'POST',
			url: '/register',
			schema: { body: Register },
			handler: this.registerHandler
		})

		instance.route({
			method: 'POST',
			url: '/login',
			schema: { body: Login },
			handler: this.loginHandler
		})
	}
}