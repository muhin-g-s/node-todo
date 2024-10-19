import { HttpErrorCode, httpResponseBase } from './base';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const errorDetails = z.object({
	method: z.string(),
	url: z.string()
})

const httpErrorResponse = httpResponseBase.extend({
	error: z.string(),
	details: errorDetails
})

type HttpErrorResponseType = z.infer<typeof httpErrorResponse>;

const createErrorInternal = (method: string, url: string): HttpErrorResponseType => ({
		error: 'Internal error',
		code: HttpErrorCode.InternalError,
		details: {
			method,
			url,
		}
	})

const createInvalidResponse = (method: string, url: string): HttpErrorResponseType => ({
		error: 'Invalid response',
		code: HttpErrorCode.InvalidResponse,
		details: {
			method,
			url,
		}
	})

const createErrorUnauthorized = (method: string, url: string): HttpErrorResponseType => ({
		error: 'Unauthorized',
		code: HttpErrorCode.Unauthorized,
		details: {
			method,
			url,
		}
	})
	
const createErrorNotFound = (method: string, url: string): HttpErrorResponseType => ({
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