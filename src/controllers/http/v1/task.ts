import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { UseCaseTask } from '@/domain/use-cases/task';
import { TaskEntity } from '@/domain/entities/task';
import { AuthMiddleware, userId } from '../middleware/auth';
import { baseHttpResponseMapping } from '../response/error';

export const prefixTask = '/task';

export class TaskHandler {
	constructor(private useCaseTask: UseCaseTask, private authMiddleware: AuthMiddleware) {
	}

	private getTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const task = await this.useCaseTask.getTask((req.params as {uuid: string})['uuid'], req[userId]);

		const response = {
			msg: 'get task',
			...task,
		}
		return reply.code(200).send(response);
	}

	private patchTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const requestData = JSON.parse(req.body as string) as TaskEntity;

		if(!requestData.description && !requestData.title && !requestData.isCompleted) {
			return reply.code(401).send({ error: 'not valid' })
		}

		const task = await this.useCaseTask.updateTask(requestData, req[userId]);

		const response = {
			msg: 'update',
			...task,
		}

		return reply.code(200).send(response);
	}

	private deleteTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		await this.useCaseTask.deleteTask((req.params as {uuid: string})['uuid'], req[userId]);

		return reply.code(200).send({status: 'ok'});
	}

	private createTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const requestData = JSON.parse(req.body as string) as TaskEntity;

		if(!requestData.description || !requestData.title || !requestData.isCompleted) {
			return reply.code(401).send({ error: 'not valid' })
		}

		const newTask: TaskEntity = {
			userId: req[userId],
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
	}

	private getAllTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasks = await this.useCaseTask.getAll(req[userId]);

		const response = {
			msg: 'all',
			tasks: [...tasks],
		}

		return reply.code(200).send(response);
	}

	private getNotCompetedTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasks = await this.useCaseTask.getNotCompleted(req[userId]);

		const response = {
			msg: 'notCompeted',
			tasks: [...tasks],
		}

		return reply.code(200).send(response);
	}

	private getCompetedTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasks = await this.useCaseTask.getCompleted(req[userId]);

		const response = {
			msg: 'competed',
			tasks: [...tasks],
		}

		return reply.code(200).send(response);
	}

	registerRoutes = async (instance: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
		instance.addHook('preHandler', this.authMiddleware.register);

		instance.route({
			method: 'GET',
			url: '/:uuid',
			schema: {
				description: 'get task',
				tags: ['task'],
				security: [{ 'apiKey': [] }],
				response: {
					...baseHttpResponseMapping
				} 
			},
			handler: this.getTaskHandler
		})

		instance.route({
			method: 'PATCH',
			url: '/',
			schema: {
				description: 'patch user',
				tags: ['task'],
				security: [{ 'apiKey': [] }],
				response: {
					...baseHttpResponseMapping
				} 
			},
			handler: this.patchTaskHandler
		})

		instance.route({
			method: 'DELETE',
			url: '/',
			schema: {
				description: 'delete user',
				tags: ['task'],
				security: [{ 'apiKey': [] }],
				response: {
					...baseHttpResponseMapping
				} 
			},
			handler: this.deleteTaskHandler
		})

		instance.route({
			method: 'POST',
			url: '/create/new',
			schema: {
				description: 'create task',
				tags: ['task'],
				security: [{ 'apiKey': [] }],
				response: {
					...baseHttpResponseMapping
				} 
			},
			handler: this.createTaskHandler
		})

		instance.route({
			method: 'GET',
			url: '/get/all',
			schema: {
				description: 'get all task',
				tags: ['task'],
				security: [{ 'apiKey': [] }],
				response: {
					...baseHttpResponseMapping
				} 
			},
			handler: this.getAllTaskHandler
		})

		instance.route({
			method: 'GET',
			url: '/get/notCompeted',
			schema: {
				description: 'get all not compete task',
				tags: ['task'],
				security: [{ 'apiKey': [] }],
				response: {
					...baseHttpResponseMapping
				} 
			},
			handler: this.getNotCompetedTaskHandler
		})

		instance.route({
			method: 'GET',
			url: '/get/competed',
			schema: {
				description: 'get all compete task',
				tags: ['task'],
				security: [{ 'apiKey': [] }],
				response: {
					...baseHttpResponseMapping
				} 
			},
			handler: this.getCompetedTaskHandler
		})
	}
}