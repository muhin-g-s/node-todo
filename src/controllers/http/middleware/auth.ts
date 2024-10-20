import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { createResponseErrorUnauthorized } from '../response/error';
interface IAuthManager {
	createToken(data: string): string
	getDataFromToken(token: string): string
}

export const userId = 'userId';

export class AuthMiddleware {

	constructor(private authManager: IAuthManager) {}

	register = (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
		const token = request.headers.authorization;

		if(!token) {
			return createResponseErrorUnauthorized(request, reply);
		}

		try {
			const id = this.authManager.getDataFromToken(token);
			request[userId] = id;
		} catch {
			return createResponseErrorUnauthorized(request, reply);
		}

		done();
	}

	addRequestUserId(instance: FastifyInstance) {
		instance.decorateRequest(userId, '')
	}
}
