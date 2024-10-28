import { LoginResponseDto, RegisterRequestDto, LoginRequestDto, RegisterResponseDto } from '../dto/auth';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { createResponseSuccess } from '../response/success';
import { httpErrorResponseAlreadyExists, httpErrorResponseErrorUnauthorized, createResponseBadRequest, baseHttpResponseMapping } from '../response/error';
import { Auth, Login } from '@/domain/entities/auth';
import { User, UserCreate } from '@/domain/entities/user';
import { AuthUseCaseError, AuthUseCaseLoginError, AuthUseCaseRegisterError } from '@/domain/errors/auth';
import { Either } from '@/lib';

export const prefixAuth = '/auth';

interface IUseCaseAuth {
	register(user: UserCreate): Promise<Either<AuthUseCaseRegisterError, User>>;
	login(login: Login): Promise<Either<AuthUseCaseLoginError, Auth>>;
}

export class AuthHandler {
	constructor(private useCaseAuth: IUseCaseAuth) { }

	private registerHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const registerDto = RegisterRequestDto.parse(req.body);

		const registerResult = await this.useCaseAuth.register(registerDto);

		if (registerResult.isError()) {
			const { error } = registerResult;

			switch (error) {
				case AuthUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				case AuthUseCaseError.AlreadyExist: return createResponseBadRequest(req, reply, 'Already exist');
				case AuthUseCaseError.PasswordTooSimple: return createResponseBadRequest(req, reply, 'Password too simple');
			}
		}

		return createResponseSuccess(reply, registerResult.value);
	}

	private loginHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const loginDto = LoginRequestDto.parse(req.body);

		const loginResult = await this.useCaseAuth.login(loginDto);

		if (loginResult.isError()) {
			const { error } = loginResult;

			switch (error) {
				case AuthUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				case AuthUseCaseError.NotFoundUser: return createResponseBadRequest(req, reply, 'Not found user');
				case AuthUseCaseError.PasswordNotCompare: return createResponseBadRequest(req, reply, 'Password not compare');
			}
		}

		const { token, userId, username } = loginResult.value;

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
					200: RegisterResponseDto,
					409: httpErrorResponseAlreadyExists,
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
					200: LoginResponseDto,
					401: httpErrorResponseErrorUnauthorized,
					...baseHttpResponseMapping
				}
			},
			handler: this.loginHandler
		})
	}
}