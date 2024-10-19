import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { UseCaseTask } from '@/domain/use-cases/task';
import { TaskEntity } from '@/domain/entities/task';
import { AuthMiddleware, userId } from '../middleware/auth';

export const prefixTask = '/task';

export class TaskHandler {
	constructor(private useCaseTask: UseCaseTask, private authMiddleware: AuthMiddleware) {
	}

	registerRoutes = async (instance: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
		instance.addHook('preHandler', this.authMiddleware.register);

		instance.get('/:uuid', async (request, reply) => {

			const task = await this.useCaseTask.getTask((request.params as {uuid: string})['uuid'], request[userId]);

			const response = {
				msg: 'get task',
				...task,
			}
			return reply.code(200).send(response);
		})

		instance.patch('/:uuid', async (request, reply) => {
			const requestData = JSON.parse(request.body as string) as TaskEntity;

			if(!requestData.description && !requestData.title && !requestData.isCompleted) {
				return reply.code(401).send({ error: 'not valid' })
			}

			const task = await this.useCaseTask.updateTask(requestData, request[userId]);

			const response = {
				msg: 'update',
				...task,
			}

			return reply.code(200).send(response);
		})

		instance.delete('/:uuid', async (request, reply) => {

			await this.useCaseTask.deleteTask((request.params as {uuid: string})['uuid'], request[userId]);

			return reply.code(200).send({status: 'ok'});
		})

		instance.post('/create', async (request, reply) => {
			const requestData = JSON.parse(request.body as string) as TaskEntity;

			if(!requestData.description || !requestData.title || !requestData.isCompleted) {
				return reply.code(401).send({ error: 'not valid' })
			}

			const newTask: TaskEntity = {
				userId: request[userId],
				title: requestData.title,
				isCompleted: requestData.isCompleted,
				description: requestData.description,
			};

			const task = await this.useCaseTask.create(newTask);

			const response = {
				msg: 'create',
				...task,
			}

			return reply.code(200).send(response);
		})

		instance.get('/all', async (request, reply) => {

			const tasks = await this.useCaseTask.getAll(request[userId]);

			const response = {
				msg: 'all',
				tasks: [...tasks],
			}

			return reply.code(200).send(response);
		})

		instance.get('/notCompeted', async (request, reply) => {

			const tasks = await this.useCaseTask.getNotCompleted(request[userId]);

			const response = {
				msg: 'notCompeted',
				tasks: [...tasks],
			}

			return reply.code(200).send(response);
		})

		instance.get('/competed', async (request, reply) => {

			const tasks = await this.useCaseTask.getCompleted(request[userId]);

			const response = {
				msg: 'competed',
				tasks: [...tasks],
			}

			return reply.code(200).send(response);
		})
	}
}