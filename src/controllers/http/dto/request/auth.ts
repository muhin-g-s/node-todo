import { z } from 'zod';

export const Register = z.object({
		username: z.string(),
    password: z.string()
});

export type RegisterType = z.infer<typeof Register>;

export const Login = z.object({
	username: z.string(),
	password: z.string()
});

export type LoginType = z.infer<typeof Login>;