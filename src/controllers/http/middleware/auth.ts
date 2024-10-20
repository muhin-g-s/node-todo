import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
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
			return reply.code(401).send({ error: 'Unauthorized' });
		}

		try {
			const id = this.authManager.getDataFromToken(token);
			request[userId] = id;
		} catch {
			return reply.code(403).send({ error: `Not verify` });
		}

		done();
	}

	addRequestUserId(instance: FastifyInstance) {
		instance.decorateRequest(userId, '')
	}
}
