import { Response } from "express";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message: string;
    meta: {
        timestamp: string;
        path: string;
        method: string;
    };
}

function successResponse<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
) {
    const response: ApiResponse<T> = {
        success: true,
        data,
        message,
        meta: {
            timestamp: new Date().toISOString(),
            path: res.req?.url,
            method: res.req?.method,
        }
    }
    return res.status(statusCode).json(response);
}

function errorResponse<T>(
    res: Response,
    message: string,
    error: string,
    statusCode: number = 500
) {
    const response: ApiResponse<T> = {
        success: false,
        error,
        message,
        meta: {
            timestamp: new Date().toISOString(),
            path: res.req?.url,
            method: res.req?.method,
        }
    }
    return res.status(statusCode).json(response);
}

const createdResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => successResponse(res, message, data, 201);

 
const noContentResponse = (res: Response): Response => res.status(204).send();

export {
    successResponse,
    errorResponse,
    createdResponse,
    noContentResponse
}