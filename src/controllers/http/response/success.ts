import { z } from 'zod';
import { FastifyReply } from 'fastify';

type Primitive = string | number | boolean | null | undefined;

type POJO = {
  [key: string]: Primitive | POJO | Array<Primitive | POJO>;
};

type NotEmpty<T> = keyof T extends never ? never : T

type NonEmptyPOJO = NotEmpty<POJO>;

export enum HttpSuccessCode {
	Ok = 200,
}

const httpStatusCodeSuccess = z.nativeEnum(HttpSuccessCode);

export const httpSuccessResponse = z.object({
	code: httpStatusCodeSuccess,
})

type HttpSuccessResponseType = z.infer<typeof httpSuccessResponse>;

interface IHttpResponseSuccess<T extends POJO> extends HttpSuccessResponseType {
  data: T;
}

const createSuccess = <T extends NonEmptyPOJO>(data: T): IHttpResponseSuccess<T> => ({
	code: HttpSuccessCode.Ok,
	data,
})

export const createResponseSuccess = <T extends NonEmptyPOJO>(reply: FastifyReply, data: T, headers?: NonEmptyPOJO) : FastifyReply => {
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        reply.header(key, value);
      }
    });
  }

	return reply.code(HttpSuccessCode.Ok).send(createSuccess(data));
};