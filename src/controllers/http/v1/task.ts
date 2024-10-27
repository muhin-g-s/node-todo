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
import { AuthMiddleware, userId } from '../middleware/auth';
import { baseHttpResponseMapping, createResponseBadRequest } from '../response/error';
import { createResponseSuccess } from '../response/success';
import { CreateTask, FindTask, Task, UpdateTask } from '@/domain/entities/task';
import { TaskUseCaseError } from '@/domain/errors/task';
import { Either } from '@/lib';

export const prefixTask = '/task';

interface IUseCaseTask {
	getTask(task: FindTask): Promise<Either<TaskUseCaseError, Task>>;
	updateTask(task: UpdateTask): Promise<Either<TaskUseCaseError, Task>>;
	deleteTask(task: FindTask): Promise<Either<TaskUseCaseError, Task>>;
	create(task: CreateTask): Promise<Either<TaskUseCaseError, Task>>;
	getAll(userId: string): Promise<Either<TaskUseCaseError, Task[]>>;
	getNotCompleted(userId: string): Promise<Either<TaskUseCaseError, Task[]>>;
	getCompleted(userId: string): Promise<Either<TaskUseCaseError, Task[]>>;
}

export class TaskHandler {
	constructor(private useCaseTask: IUseCaseTask, private authMiddleware: AuthMiddleware) {
	}

	private getTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const task: FindTask = {
			id: (req.params as { uuid: string })['uuid'],
			userId: req[userId],
		}

		const taskResult = await this.useCaseTask.getTask(task);

		if (taskResult.isError()) {
			const { error } = taskResult;

			switch (error) {
				case TaskUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				case TaskUseCaseError.NotBelongingUser: return createResponseBadRequest(req, reply, 'Not belonging user');
				default: return createResponseBadRequest(req, reply);
			}
		}

		return createResponseSuccess(reply, taskResult.value);
	}

	private patchTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const patchTaskRequestDto = PatchTaskRequestDto.parse(req.body);

		const task: UpdateTask = {
			id: req[userId],
			...patchTaskRequestDto
		};

		const taskResult = await this.useCaseTask.updateTask(task);

		if (taskResult.isError()) {
			const { error } = taskResult;

			switch (error) {
				case TaskUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				case TaskUseCaseError.NotBelongingUser: return createResponseBadRequest(req, reply, 'Not belonging user');
				default: return createResponseBadRequest(req, reply);
			}
		}

		return createResponseSuccess(reply, taskResult.value);
	}

	private deleteTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const task: FindTask = {
			id: (req.params as { uuid: string })['uuid'],
			userId: req[userId],
		}

		const taskResult = await this.useCaseTask.deleteTask(task);

		if (taskResult.isError()) {
			const { error } = taskResult;

			switch (error) {
				case TaskUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				case TaskUseCaseError.NotBelongingUser: return createResponseBadRequest(req, reply, 'Not belonging user');
				default: return createResponseBadRequest(req, reply);
			}
		}

		return createResponseSuccess(reply, taskResult.value);
	}

	private createTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const taskDto = CreateTaskRequestDto.parse(req.body);

		const task: CreateTask = {
			userId: req[userId],
			...taskDto,
		}

		const taskResult = await this.useCaseTask.create(task);

		if (taskResult.isError()) {
			const { error } = taskResult;

			switch (error) {
				case TaskUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				default: return createResponseBadRequest(req, reply);
			}
		}

		return createResponseSuccess(reply, taskResult.value);
	}

	private getAllTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasksResult = await this.useCaseTask.getAll(req[userId]);

		if (tasksResult.isError()) {
			const { error } = tasksResult;

			switch (error) {
				case TaskUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				default: return createResponseBadRequest(req, reply);
			}
		}

		return createResponseSuccess(reply, { tasks: tasksResult.value });
	}

	private getNotCompetedTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasksResult = await this.useCaseTask.getNotCompleted(req[userId]);

		if (tasksResult.isError()) {
			const { error } = tasksResult;

			switch (error) {
				case TaskUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				default: return createResponseBadRequest(req, reply);
			}
		}

		return createResponseSuccess(reply, { tasks: tasksResult.value });
	}

	private getCompetedTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasksResult = await this.useCaseTask.getCompleted(req[userId]);

		if (tasksResult.isError()) {
			const { error } = tasksResult;

			switch (error) {
				case TaskUseCaseError.UnknownError: return createResponseBadRequest(req, reply);
				default: return createResponseBadRequest(req, reply);
			}
		}

		return createResponseSuccess(reply, { tasks: tasksResult.value });
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