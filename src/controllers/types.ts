import { type FastifyRequest as BaseFastifyRequest } from 'fastify';

export const additionalKeyUserId = 'userId' as const

declare module 'fastify' {
	// type MyFastifyRequest = BaseFastifyRequest & {
	// 	 [additionalKeyUserId]: string;
	// }
}