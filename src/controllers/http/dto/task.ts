import { z } from 'zod';
import { httpSuccessResponse } from './../response/success';

export const GetTaskResponseDto = httpSuccessResponse.extend({
	data: z.object({
		id: z.string(),
		userId: z.string(),
		title: z.string(),
		description: z.string(),
		isCompleted: z.boolean(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		deleteAt: z.date().optional(),
	})
});

export type GetTaskResponseDtoType = z.infer<typeof GetTaskResponseDto>;

export const PatchTaskRequestDto = z.object({
	userId: z.string(),
	title: z.string(),
	description: z.string(),
	isCompleted: z.boolean()
});

export type PatchTaskRequestDtoType = z.infer<typeof PatchTaskRequestDto>;

export const PatchTaskResponseDto = httpSuccessResponse.extend({
	data: z.object({
		id: z.string(),
		userId: z.string(),
		title: z.string(),
		description: z.string(),
		isCompleted: z.boolean(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		deleteAt: z.date().optional(),
	})
});

export type PatchTaskResponseDtoType = z.infer<typeof PatchTaskResponseDto>;

export const DeleteTaskResponseDto = httpSuccessResponse.extend({
	data: z.object({
		status: z.string(),
	})
});

export type DeleteTaskResponseDtoType = z.infer<typeof DeleteTaskResponseDto>;

export const CreateTaskRequestDto = httpSuccessResponse.extend({
	title: z.string(),
	description: z.string(),
	isCompleted: z.boolean(),
});

export type CreateTaskRequestDtoType = z.infer<typeof CreateTaskRequestDto>;

export const CreateTaskResponseDto = httpSuccessResponse.extend({
	data: z.object({
		id: z.string(),
		userId: z.string(),
		title: z.string(),
		description: z.string(),
		isCompleted: z.boolean(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		deleteAt: z.date().optional(),
	})
});

export type CreateTaskResponseDtoType = z.infer<typeof CreateTaskResponseDto>;

export const GetAllTaskResponseDto = httpSuccessResponse.extend({
	data: z.object({
		id: z.string(),
		userId: z.string(),
		title: z.string(),
		description: z.string(),
		isCompleted: z.boolean(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		deleteAt: z.date().optional(),
	}).array(),
});

export type GetAllTaskResponseDtoType = z.infer<typeof GetAllTaskResponseDto>;

export const GetNotCompleteTaskResponseDto = httpSuccessResponse.extend({
	data: z.object({
		id: z.string(),
		userId: z.string(),
		title: z.string(),
		description: z.string(),
		isCompleted: z.boolean(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		deleteAt: z.date().optional(),
	}).array(),
});

export type GetNotCompleteTaskResponseDtoType = z.infer<typeof GetNotCompleteTaskResponseDto>;

export const GetCompleteTaskResponseDto = httpSuccessResponse.extend({
	data: z.object({
		id: z.string(),
		userId: z.string(),
		title: z.string(),
		description: z.string(),
		isCompleted: z.boolean(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		deleteAt: z.date().optional(),
	}).array(),
});

export type GetCompleteTaskResponseDtoType = z.infer<typeof GetCompleteTaskResponseDto>;