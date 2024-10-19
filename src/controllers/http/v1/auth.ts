import { LoginResponseDto, RegisterRequestDto, LoginRequestDto, RegisterResponseDto } from '../dto/auth';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { UseCaseAuth } from '@/domain/use-cases/user';
import { UserEntity } from '@/domain/entities/user';
import { createResponseSuccess } from '../response/success';
import { httpErrorResponseAlreadyExists, httpErrorResponseErrorInternal, httpErrorResponseErrorUnauthorized, httpErrorResponseInvalidResponse } from '../response/error';

export const prefixAuth = '/auth';

export class AuthHandler {
	constructor(private useCaseAuth: UseCaseAuth) {
	}

	private registerHandler = async ({ body }: FastifyRequest, reply: FastifyReply) => {
		const userDto = RegisterRequestDto.parse(body);

		const user: UserEntity = {...userDto, id: ''};

		const { username, id } = await this.useCaseAuth.register(user);

		return createResponseSuccess(reply, {	
			username,
			id:id ?? ''
		});
	}

	private loginHandler = async ({ body }: FastifyRequest, reply: FastifyReply) => {
		const userDto = LoginRequestDto.parse(body);

		const user: UserEntity = {...userDto, id: ''};

		const { token, userId, username } = await this.useCaseAuth.login(user);

		return createResponseSuccess(reply, {	
			username,
			id: userId,
		}, {
			authorization: token,
		});
	}

	registerRoutes = async (instance: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
		instance.route({
			method: 'POST',
			url: '/register',
			schema: {
				description: 'register',
				tags: ['auth'],
				body: RegisterRequestDto, 
				response: {
					200 : RegisterResponseDto,		
					400 : httpErrorResponseInvalidResponse,
					409 : httpErrorResponseAlreadyExists,
					500 : httpErrorResponseErrorInternal
				} 
			},
			handler: this.registerHandler
		})

		instance.route({
			method: 'POST',
			url: '/login',
			schema: {
				description: 'login',
				tags: ['auth'],
				body: LoginRequestDto, 
				response: {
					200 : LoginResponseDto,
					400 : httpErrorResponseInvalidResponse,
					401 : httpErrorResponseErrorUnauthorized,
					500 : httpErrorResponseErrorInternal
				} 
			},
			handler: this.loginHandler
		})
	}
}