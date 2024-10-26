import { DeleteUserResponseDto, GetUserResponseDto, PatchUserRequestDto, PatchUserResponseDto } from './../dto/user';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { UseCaseUser } from '@/domain/use-cases/user';
import { AuthMiddleware, userId } from '../middleware/auth';
import { baseHttpResponseMapping, catchNonBusinessErrors, createResponseBadRequest } from '../response/error';
import { createResponseSuccess } from '../response/success';
import { UpdateUser } from '@/domain/entities/user';

export const prefixUser = '/user';

export class UserHandler {
	constructor(private useCaseUser: UseCaseUser, private authMiddleware: AuthMiddleware) {
	}

	private getUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const id = req[userId];

			const user = await this.useCaseUser.getUser(id);

			if (!user) {
				return createResponseBadRequest(req, reply);
			}

			const { password, ...userWithoutPassword } = user;

			return createResponseSuccess(reply, userWithoutPassword);
		} catch (e) {
			const nonBusinessErrorResponse = catchNonBusinessErrors(e, req, reply);

			if (nonBusinessErrorResponse) {
				return nonBusinessErrorResponse;
			}

			return createResponseBadRequest(req, reply);
		}
	}

	private patchUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const patchUserRequestDto = PatchUserRequestDto.parse(req.body);

			const id = req[userId];

			const user: UpdateUser = { ...patchUserRequestDto, id };

			const updatedUser = await this.useCaseUser.updateUser({
				...user,
				id
			});

			const { password, ...userWithoutPassword } = updatedUser;

			return createResponseSuccess(reply, userWithoutPassword);
		} catch (e) {
			const nonBusinessErrorResponse = catchNonBusinessErrors(e, req, reply);

			if (nonBusinessErrorResponse) {
				return nonBusinessErrorResponse;
			}

			return createResponseBadRequest(req, reply);
		}
	}

	private deleteUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const id = req[userId];

			await this.useCaseUser.deleteUser(id);

			return createResponseSuccess(reply, { status: 'ok' });
		} catch (e) {
			const nonBusinessErrorResponse = catchNonBusinessErrors(e, req, reply);

			if (nonBusinessErrorResponse) {
				return nonBusinessErrorResponse;
			}

			return createResponseBadRequest(req, reply);
		}
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