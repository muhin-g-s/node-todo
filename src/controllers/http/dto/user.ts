import { httpSuccessResponse } from './../response/success';
import { z } from 'zod';


export const GetUserResponseDto = httpSuccessResponse.extend({
	data: z.object({
		id: z.string(),
    username: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deleteAt: z.date().optional(),
	})
});

export type GetUserResponseDtoType = z.infer<typeof GetUserResponseDto>;

export const PatchUserRequestDto = z.object({ 
		username: z.string(),
    password: z.string()
});

export type PatchUserRequestDtoType = z.infer<typeof PatchUserRequestDto>;

export const PatchUserResponseDto = httpSuccessResponse.extend({
	data: z.object({
		id: z.string(),
    username: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deleteAt: z.date().optional(),
	})
});

export type PatchUserResponseDtoType = z.infer<typeof GetUserResponseDto>;

export const DeleteUserResponseDto = httpSuccessResponse.extend({
	data: z.object({
		status: z.string(),
	})
});

export type DeleteUserResponseDtoType = z.infer<typeof DeleteUserResponseDto>;