import { z } from 'zod';

export enum HttpErrorCode {
	InvalidResponse = 400,
	Unauthorized = 403,
	NotFound = 404,
	InternalError = 500,
}

export enum HttpSuccessCode {
	Ok = 200,
}

const httpStatusCode = z.union([
  z.nativeEnum(HttpErrorCode),
  z.nativeEnum(HttpSuccessCode)
]);

export const httpResponseBase = z.object({
  code: httpStatusCode,
});