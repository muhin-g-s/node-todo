import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { UseCaseUser } from '@/domain/use-cases/user';
import { UserEntity } from '@/domain/entities/user';
import { AuthMiddleware, userId } from '../middleware/auth';

export const prefixUser = '/user';

export class UserHandler {
	constructor(private useCaseUser: UseCaseUser, private authMiddleware: AuthMiddleware) {
	}

	registerRoutes = async (instance: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
		instance.addHook('preHandler', this.authMiddleware.register);

		instance.get('/', async (request, reply) => {
			const id = request[userId];

			const user = await this.useCaseUser.getUser(id);

			const { password, ...userWithoutPassword } = user;

			const response = {
				msg: 'get user',
				...userWithoutPassword,
			}
			return reply.code(200).send(response);
		})

		instance.patch('/', async (request, reply) => {
			const requestData = JSON.parse(request.body as string) as UserEntity;

			if(!requestData.password && !requestData.username) {
				return reply.code(401).send({ error: 'not valid' })
			}

			const id = request[userId];

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
		})

		instance.delete('/', async (request, reply) => {
			const id = request[userId];

			await this.useCaseUser.deleteUser(id);

			return reply.code(200).send({status: 'ok'});
		})
	}
}