class AppError extends Error {

    public statusCode: number;
    public isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this,this.constructor);
    }

}

class NotFoundError extends AppError {
    constructor(message: string = 'Resource Not Found') {
        super(404,message);
    }
}

class BadRequestError extends AppError {
    constructor(message: string = 'Bad Request') {
        super(400, message);
    }
}

class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(401, message);
    }
}

class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}
 
class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(409, message);
  }
}
 
class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(422, message);
  }
}
 
class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message);
  }
}

export {
    AppError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    ValidationError,
    InternalServerError
}