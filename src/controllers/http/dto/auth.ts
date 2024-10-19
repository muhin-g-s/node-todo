import { z } from 'zod';

export const RegisterRequestDto = z.object({
		username: z.string(),
    password: z.string()
});

export type RegisterRequestDtoType = z.infer<typeof RegisterRequestDto>;

export const LoginRequestDto = z.object({
	username: z.string(),
	password: z.string()
});

export type LoginRequestDtoType = z.infer<typeof LoginRequestDto>;

export const RegisterResponseDto = z.object({
	username: z.string(),
	id: z.string(),
});

export type RegisterResponseDtoType = z.infer<typeof RegisterResponseDto>;

export const LoginResponseDto = z.object({
	username: z.string(),
	id: z.string(),
});

export type LoginResponseDtoType = z.infer<typeof LoginResponseDto>;