import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { UseCaseUser } from '@/domain/use-cases/user';
import { AuthMiddleware, userId } from '../middleware/auth';
import { baseHttpResponseMapping } from '../response/error';
import { UserEntity } from '@/domain/entities/user';

export const prefixUser = '/user';

export class UserHandler {
	constructor(private useCaseUser: UseCaseUser, private authMiddleware: AuthMiddleware) {
	}

	private getUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
			const id = req[userId];

			const user = await this.useCaseUser.getUser(id);

			if(!user) {
				return reply.code(404).send({status: 'not-found'});
			}

			const { password, ...userWithoutPassword } = user;

			const response = {
				msg: 'get user',
				...userWithoutPassword,
			}
			return reply.code(200).send(response);
	}

	private patchUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
			const requestData = JSON.parse(req.body as string) as UserEntity;

			if(!requestData.password && !requestData.username) {
				return reply.code(401).send({ error: 'not valid' })
			}

			const id = req[userId];

			const user = await this.useCaseUser.updateUser({
				...requestData,
				id
			});

			const { password, ...userWithoutPassword } = user;

			const response = {
				msg: 'update',
				...userWithoutPassword,
			}
			return reply.code(200).send(response);
	}

	private deleteUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
			const id = req[userId];

			await this.useCaseUser.deleteUser(id);

			return reply.code(200).send({status: 'ok'});
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
				response: {
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
					...baseHttpResponseMapping
				},
			},
			handler: this.deleteUserHandler
		})
	}
}