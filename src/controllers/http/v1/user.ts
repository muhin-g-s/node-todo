import { DeleteUserResponseDto, GetUserResponseDto, PatchUserRequestDto, PatchUserResponseDto } from './../dto/user';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { AuthMiddleware, userId } from '../middleware/auth';
import { baseHttpResponseMapping, createResponseBadRequest } from '../response/error';
import { createResponseSuccess } from '../response/success';
import { UpdateUser, User } from '@/domain/entities/user';
import { UserUseCaseDeleteError, UserUseCaseError, UserUseCaseGetError, UserUseCaseUpdateError } from '@/domain/errors/user';
import { Either } from '@/lib';

export const prefixUser = '/user';

interface IUseCaseUser {
	getUser(userId: string): Promise<Either<UserUseCaseGetError, User>>;
	updateUser(user: UpdateUser): Promise<Either<UserUseCaseUpdateError, User>>;
	deleteUser(userId: string): Promise<Either<UserUseCaseDeleteError, User>>;
}

export class UserHandler {
	constructor(private useCaseUser: IUseCaseUser, private authMiddleware: AuthMiddleware) { }

	private getUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const id = req[userId];

		const userResult = await this.useCaseUser.getUser(id);

		if (userResult.isError()) {
			const { error } = userResult;

			switch (error) {
				case UserUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				case UserUseCaseError.NotFoundUser: return createResponseBadRequest(req, reply, 'Not found user');
			}
		}

		const { password, ...userWithoutPassword } = userResult.value;

		return createResponseSuccess(reply, userWithoutPassword);
	}

	private patchUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const patchUserRequestDto = PatchUserRequestDto.parse(req.body);

		const id = req[userId];

		const user: UpdateUser = { ...patchUserRequestDto, id };

		const userResult = await this.useCaseUser.updateUser({
			...user,
			id
		});

		if (userResult.isError()) {
			const { error } = userResult;

			switch (error) {
				case UserUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				case UserUseCaseError.NotFoundUser: return createResponseBadRequest(req, reply, 'Not found user');
				case UserUseCaseError.PasswordTooSimple: return createResponseBadRequest(req, reply, 'Password too simple');
			}
		}

		const { password, ...userWithoutPassword } = userResult.value;

		return createResponseSuccess(reply, userWithoutPassword);
	}

	private deleteUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const id = req[userId];

		const userResult = await this.useCaseUser.deleteUser(id);

		if (userResult.isError()) {
			const { error } = userResult;

			switch (error) {
				case UserUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				case UserUseCaseError.NotFoundUser: return createResponseBadRequest(req, reply, 'Not found user');
			}
		}

		return createResponseSuccess(reply, { status: 'ok' });
	}

	registerRoutes = async (instance: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
		instance.addHook('preHandler', this.authMiddleware.register);

		instance.route({
			method: 'GET',
			url: '/',
			schema: {
				description: 'get user',
				tags: ['user'],
				security: [{ 'apiKey': [] }],
				response: {
					200: GetUserResponseDto,
					...baseHttpResponseMapping
				}
			},
			handler: this.getUserHandler
		})

		instance.route({
			method: 'PATCH',
			url: '/',
			schema: {
				description: 'patch user',
				tags: ['user'],
				security: [{ 'apiKey': [] }],
				body: PatchUserRequestDto,
				response: {
					200: PatchUserResponseDto,
					...baseHttpResponseMapping
				}
			},
			handler: this.patchUserHandler
		})

		instance.route({
			method: 'DELETE',
			url: '/',
			schema: {
				description: 'delete user',
				tags: ['user'],
				security: [{ 'apiKey': [] }],
				response: {
					200: DeleteUserResponseDto,
					...baseHttpResponseMapping
				},
			},
			handler: this.deleteUserHandler
		})
	}
}