import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { errorResponse } from "../utils/response.js";

const errorHandler = (
    err: Error | AppError | ZodError,
    _req: Request, 
    res: Response, 
    _next: NextFunction
) => {
    
    if(err instanceof AppError) {
        errorResponse(
            res,
            err.message,
            'Validation Or Business Logic Error',
            err.statusCode
        );
    }

    if(err instanceof ZodError) {

        const errorDetails = err.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));

        const errorMessage = `Validation failed: ${errorDetails.map(detail => `${detail.field}: ${detail.message}`).join(', ')}`;
        errorResponse(
            res,
            errorMessage,
            'Validation Error',
            400
        );

    }

    if (err.name === 'PrismaClientKnownRequestError') {
        
        const prismaError = err as any;
    
        if (prismaError.code === 'P2002') {
            
            errorResponse(
                res,
                'A record with this value already exists',
                'Database constraint violation',
                409
            );

        }
    
        if (prismaError.code === 'P2025') {
            
            errorResponse(
                res,
                'Record not found',
                'Database error',
                404
            );
        }
    
        errorResponse(
            res,
            'Database error occurred',
            'Database error',
            400
        );
    }
 
    if (err.name === 'PrismaClientInitializationError') {
        errorResponse(
            res,
            'Database connection failed',
            'Database connection error',
            503
        );
    }

    errorResponse(
        res,
        'Internal server error',
        'Unexpected error occurred',
        500
    );
};

export default errorHandler;
