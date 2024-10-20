import { BusinessLogicError, DomainError } from '@/domain/errors';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

enum HttpErrorCode {
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	AlreadyExists = 409, 
	InternalError = 500,
}

const httpStatusCodeError = z.nativeEnum(HttpErrorCode);

const errorDetails = z.object({
	method: z.string(),
	url: z.string()
})

const httpErrorResponse = z.object({
	error: z.string(),
	details: errorDetails,
	code: httpStatusCodeError,
})

type HttpErrorResponseType = z.infer<typeof httpErrorResponse>;

const createErrorInternal = (method: string, url: string): HttpErrorResponseType => ({
	error: 'Internal server error',
	code: HttpErrorCode.InternalError,
	details: {
		method,
		url,
	}
})

const createBadRequest = (method: string, url: string, error?: string): HttpErrorResponseType => ({
	error: error || 'Bad request',
	code: HttpErrorCode.BadRequest,
	details: {
		method,
		url,
	}
})

const createErrorForbidden = (method: string, url: string): HttpErrorResponseType => ({
	error: 'Forbidden',
	code: HttpErrorCode.Forbidden,
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

const createErrorUnauthorized = (method: string, url: string): HttpErrorResponseType => ({
	error: 'Unauthorized',
	code: HttpErrorCode.Unauthorized,
	details: {
		method,
		url,
	}
})

const createErrorAlreadyExists = (method: string, url: string): HttpErrorResponseType => ({
	error: 'Already exists',
	code: HttpErrorCode.AlreadyExists,
	details: {
		method,
		url,
	}
})

export const createResponseNotFound = (req: FastifyRequest, reply: FastifyReply) => reply.code(HttpErrorCode.NotFound).send(createErrorNotFound(req.method, req.url));
export const createResponseErrorInternal = (req: FastifyRequest, reply: FastifyReply) => reply.code(HttpErrorCode.InternalError).send(createErrorInternal(req.method, req.url));
export const createResponseBadRequest = (req: FastifyRequest, reply: FastifyReply, error?: string) => reply.code(HttpErrorCode.BadRequest).send(createBadRequest(req.method, req.url, error));
export const createResponseErrorUnauthorized = (req: FastifyRequest, reply: FastifyReply) => reply.code(HttpErrorCode.Unauthorized).send(createErrorUnauthorized(req.method, req.url));
export const createResponseErrorForbidden = (req: FastifyRequest, reply: FastifyReply) => reply.code(HttpErrorCode.Forbidden).send(createErrorForbidden(req.method, req.url));
export const createResponseErrorAlreadyExists = (req: FastifyRequest, reply: FastifyReply) => reply.code(HttpErrorCode.Forbidden).send(createErrorAlreadyExists(req.method, req.url));

export const httpErrorResponseNotFound = httpErrorResponse.merge(z.object({
	code: z.literal(HttpErrorCode.NotFound),
}));

export const httpErrorResponseErrorInternal = httpErrorResponse.merge(z.object({
	code: z.literal(HttpErrorCode.InternalError),
}));

export const httpErrorResponseBadRequest = httpErrorResponse.merge(z.object({
	code: z.literal(HttpErrorCode.BadRequest),
}));

export const httpErrorResponseErrorForbidden = httpErrorResponse.merge(z.object({
	code: z.literal(HttpErrorCode.Forbidden),
}));

export const httpErrorResponseErrorUnauthorized = httpErrorResponse.merge(z.object({
	code: z.literal(HttpErrorCode.Unauthorized),
}));

export const httpErrorResponseAlreadyExists = httpErrorResponse.merge(z.object({
	code: z.literal(HttpErrorCode.AlreadyExists),
}));

export const baseHttpResponseMapping = {
	400 : httpErrorResponseBadRequest,
	500 : httpErrorResponseErrorInternal
}

export const catchNonBusinessErrors = (e: unknown, req: FastifyRequest, reply: FastifyReply): FastifyReply | null => {
	if(!(e instanceof DomainError)) {
		return createResponseErrorInternal(req, reply);
	}

	if(!(e instanceof BusinessLogicError)) {
		return createResponseErrorInternal(req, reply);
	}

	return null
}