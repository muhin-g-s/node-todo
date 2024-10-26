import {
	CreateTaskRequestDto,
	GetTaskResponseDto,
	PatchTaskRequestDto,
	DeleteTaskResponseDto,
	PatchTaskResponseDto,
	CreateTaskResponseDto,
	GetAllTaskResponseDto,
	GetNotCompleteTaskResponseDto,
	GetCompleteTaskResponseDto
} from './../dto/task';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { UseCaseTask } from '@/domain/use-cases/task';
import { AuthMiddleware, userId } from '../middleware/auth';
import { baseHttpResponseMapping } from '../response/error';
import { createResponseSuccess } from '../response/success';
import { CreateTask, FindTask, UpdateTask } from '@/domain/entities/task';

export const prefixTask = '/task';

export class TaskHandler {
	constructor(private useCaseTask: UseCaseTask, private authMiddleware: AuthMiddleware) {
	}

	private getTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const task: FindTask = {
			id: (req.params as { uuid: string })['uuid'],
			userId: req[userId],
		}

		const taskEntity = await this.useCaseTask.getTask(task);

		return createResponseSuccess(reply, taskEntity);
	}

	private patchTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const patchTaskRequestDto = PatchTaskRequestDto.parse(req.body);

		const task: UpdateTask = {
			id: req[userId],
			...patchTaskRequestDto
		};

		const updatedTask = await this.useCaseTask.updateTask(task);

		return createResponseSuccess(reply, updatedTask);
	}

	private deleteTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const task: FindTask = {
			id: (req.params as { uuid: string })['uuid'],
			userId: req[userId],
		}

		const deletedTask = await this.useCaseTask.deleteTask(task);

		return createResponseSuccess(reply, deletedTask);
	}

	private createTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const taskDto = CreateTaskRequestDto.parse(req.body);

		const task: CreateTask = {
			userId: req[userId],
			...taskDto,
		}

		const newTask = await this.useCaseTask.create(task);

		return createResponseSuccess(reply, newTask);
	}

	private getAllTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasks = await this.useCaseTask.getAll(req[userId]);

		return createResponseSuccess(reply, { tasks: tasks });
	}

	private getNotCompetedTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasks = await this.useCaseTask.getAll(req[userId]);

		return createResponseSuccess(reply, { tasks: tasks });
	}

	private getCompetedTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasks = await this.useCaseTask.getAll(req[userId]);

		return createResponseSuccess(reply, { tasks: tasks });
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
					200: GetTaskResponseDto,
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
				body: PatchTaskRequestDto,
				security: [{ 'apiKey': [] }],
				response: {
					200: PatchTaskResponseDto,
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
					200: DeleteTaskResponseDto,
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
				body: CreateTaskRequestDto,
				security: [{ 'apiKey': [] }],
				response: {
					200: CreateTaskResponseDto,
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
					200: GetAllTaskResponseDto,
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
					200: GetNotCompleteTaskResponseDto,
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
					200: GetCompleteTaskResponseDto,
					...baseHttpResponseMapping
				}
			},
			handler: this.getCompetedTaskHandler
		})
	}
}