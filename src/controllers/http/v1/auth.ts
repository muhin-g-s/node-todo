import { LoginResponseDto, RegisterRequestDto, LoginRequestDto, RegisterResponseDto } from '../dto/auth';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { UseCaseAuth } from '@/domain/use-cases/user';
import { UserEntity } from '@/domain/entities/user';
import { createResponseSuccess } from '../response/success';
import { httpErrorResponseAlreadyExists, httpErrorResponseErrorUnauthorized, createResponseBadRequest, baseHttpResponseMapping, catchNonBusinessErrors } from '../response/error';
import { UserOperationError, UserOperationErrorMessages } from '@/domain/errors';

export const prefixAuth = '/auth';

export class AuthHandler {
	constructor(private useCaseAuth: UseCaseAuth) {
	}

	private registerHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const userDto = RegisterRequestDto.parse(req.body);

		const user: UserEntity = {...userDto, id: ''};

		try {
			const { username, id } = await this.useCaseAuth.register(user);

			return createResponseSuccess(reply, {	
				username,
				id:id ?? ''
			});
		} catch (e) {
			const nonBusinessErrorResponse = catchNonBusinessErrors(e, req, reply);

			if (nonBusinessErrorResponse) {
				return nonBusinessErrorResponse;
			}

			if(!(e instanceof UserOperationError)) {
				return createResponseBadRequest(req, reply);
			}
			
			const message = e.message as UserOperationErrorMessages;

			switch(message) {
				case UserOperationErrorMessages.PasswordTooSimple: 
					return createResponseBadRequest(req, reply, UserOperationErrorMessages.PasswordTooSimple);
				default:
					return createResponseBadRequest(req, reply);
			}
		}
	}

	private loginHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const userDto = LoginRequestDto.parse(req.body);

		const user: UserEntity = {...userDto, id: ''};

		try {
			const { token, userId, username } = await this.useCaseAuth.login(user);

			return createResponseSuccess(reply, {	
				username,
				id: userId,
			}, {
				authorization: token,
			});
		} catch (e) {
			const nonBusinessErrorResponse = catchNonBusinessErrors(e, req, reply);
			
			if (nonBusinessErrorResponse) {
				return nonBusinessErrorResponse;
			}

			if(!(e instanceof UserOperationError)) {
				return createResponseBadRequest(req, reply);
			}
			
			const message = e.message as UserOperationErrorMessages;

			switch(message) {
				case UserOperationErrorMessages.PasswordTooSimple: 
					return createResponseBadRequest(req, reply, UserOperationErrorMessages.PasswordTooSimple);
				default:
					return createResponseBadRequest(req, reply);
			}
		}
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
					409 : httpErrorResponseAlreadyExists,
					...baseHttpResponseMapping
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
					401 : httpErrorResponseErrorUnauthorized,
					...baseHttpResponseMapping
				} 
			},
			handler: this.loginHandler
		})
	}
}