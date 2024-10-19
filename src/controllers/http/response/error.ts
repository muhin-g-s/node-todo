import { HttpErrorCode, IHttpResponse } from './base';
import { FastifyReply, FastifyRequest } from 'fastify';

interface IErrorDetails {
	method: string,
	url: string,
}

interface IHttpError extends IHttpResponse {
	error: string;
	details: IErrorDetails,
}

const createErrorInternal = (method: string, url: string): IHttpError => ({
		error: 'Internal error',
		code: HttpErrorCode.InternalError,
		details: {
			method,
			url,
		}
	})

const createInvalidResponse = (method: string, url: string): IHttpError => ({
		error: 'Invalid response',
		code: HttpErrorCode.InvalidResponse,
		details: {
			method,
			url,
		}
	})

const createErrorUnauthorized = (method: string, url: string): IHttpError => ({
		error: 'Unauthorized',
		code: HttpErrorCode.Unauthorized,
		details: {
			method,
			url,
		}
	})
	
const createErrorNotFound = (method: string, url: string): IHttpError => ({
	error: 'Not Found',
	code: HttpErrorCode.NotFound,
	details: {
		method,
		url,
	}
})

export const createResponseNotFound = (req: FastifyRequest, reply: FastifyReply) => reply.code(HttpErrorCode.NotFound).send(createErrorNotFound(req.method, req.url));
export const createResponseErrorInternal = (req: FastifyRequest, reply: FastifyReply) => reply.code(HttpErrorCode.NotFound).send(createErrorInternal(req.method, req.url));
export const createResponseInvalidResponse = (req: FastifyRequest, reply: FastifyReply) => reply.code(HttpErrorCode.NotFound).send(createInvalidResponse(req.method, req.url));
export const createResponseErrorUnauthorized = (req: FastifyRequest, reply: FastifyReply) => reply.code(HttpErrorCode.NotFound).send(createErrorUnauthorized(req.method, req.url));