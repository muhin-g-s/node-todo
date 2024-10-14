import { additionalKeyUserId } from '../types';
import { IAuthManager } from './../../pkg/auth-manager/interface-auth-manager';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export class AuthMiddleware {

	constructor(private authManager: IAuthManager) {}

	async register(request: FastifyRequest & {[additionalKeyUserId]: string}, reply: FastifyReply) {
		const token = request.headers['x-api-key'] as string;

		// if(!token) {
		// 	return reply.code(401).send({ error: 'Unauthorized' });
		// }

		const {data: userId, err} = this.authManager.getDataFromToken(token);

		// if(err) {
		// 	return reply.code(401).send({ error: 'Unauthorized' });
		// }

		// const key = this.key; 

		request[additionalKeyUserId] = 'test';
		// request
	}

	addRequestUserId(instance: FastifyInstance) {
		instance.decorateRequest(additionalKeyUserId, '')
	}
}