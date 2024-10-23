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

export const prefixTask = '/task';

export class TaskHandler {
	constructor(private useCaseTask: UseCaseTask, private authMiddleware: AuthMiddleware) {
	}

	private getTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const taskEntity = await this.useCaseTask.getTask((req.params as {uuid: string})['uuid'], req[userId]);

		if(taskEntity) {
			return createResponseSuccess(reply, taskEntity as any);
		} else {
			return createResponseSuccess(reply, [] as any);
		}
	}

	private patchTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const patchTaskRequestDto = PatchTaskRequestDto.parse(req.body);

		const task = await this.useCaseTask.updateTask(
			{...patchTaskRequestDto, id: '', createdAt: null, updatedAt: null, deleteAt: null}, 
			req[userId]
		);

		return createResponseSuccess(reply, task as any);
	}

	private deleteTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		await this.useCaseTask.deleteTask((req.params as {uuid: string})['uuid'], req[userId]);

		return createResponseSuccess(reply, {status: 'ok'});
	}

	private createTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const taskDto = CreateTaskRequestDto.parse(req.body);

		const task = await this.useCaseTask.create(
			{...taskDto, id: '', userId: req[userId], createdAt: null, updatedAt: null, deleteAt: null}
		);

		return createResponseSuccess(reply, task as any);
	}

	private getAllTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasks = await this.useCaseTask.getAll(req[userId]);

		return createResponseSuccess(reply, tasks as any);
	}

	private getNotCompetedTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasks = await this.useCaseTask.getAll(req[userId]);

		return createResponseSuccess(reply, tasks as any);
	}

	private getCompetedTaskHandler = async (req: FastifyRequest, reply: FastifyReply) => {
		const tasks = await this.useCaseTask.getAll(req[userId]);

		return createResponseSuccess(reply, tasks as any);
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