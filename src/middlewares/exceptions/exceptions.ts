import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: Error, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;

    const responseBody = {
      status: httpStatus,
      message: exception instanceof PrismaClientKnownRequestError ?  exception.code : exception.message
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
