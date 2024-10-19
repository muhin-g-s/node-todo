import { LoginResponseDtoType, LoginResponseDto, RegisterRequestDto, RegisterResponseDtoType, LoginRequestDto, RegisterResponseDto } from '../dto/auth';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { UseCaseAuth } from '@/domain/use-cases/user';
import { UserEntity } from '@/domain/entities/user';

export const prefixAuth = '/auth';

export class AuthHandler {
	constructor(private useCaseAuth: UseCaseAuth) {
	}

	private registerHandler = async ({ body }: FastifyRequest, reply: FastifyReply) => {
		const userDto = RegisterRequestDto.parse(body);

		const user: UserEntity = {...userDto, id: ''};

		const { username, id } = await this.useCaseAuth.register(user);

		const response: RegisterResponseDtoType = {
			username,
			id:id ?? ''
		}

		return reply.code(200).send(response);
	}

	private loginHandler = async ({ body }: FastifyRequest, reply: FastifyReply) => {
		const userDto = LoginRequestDto.parse(body);

		const user: UserEntity = {...userDto, id: ''};

		const { token, userId, username } = await this.useCaseAuth.login(user);

		const response: LoginResponseDtoType = {
			id: userId,
			username,
		}

		return reply.code(200).header('authorization', token).send(response);
	}

	registerRoutes = async (instance: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
		instance.route({
			method: 'POST',
			url: '/register',
			schema: { body: RegisterRequestDto, response: {
				'200' : RegisterResponseDto,
			} },
			handler: this.registerHandler
		})

		instance.route({
			method: 'POST',
			url: '/login',
			schema: { body: LoginRequestDto, response: {
				'200' : LoginResponseDto,
			} },
			handler: this.loginHandler
		})
	}
}