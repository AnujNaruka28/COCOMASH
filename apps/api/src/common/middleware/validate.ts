import { ZodType } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/AppError.js";

const validate = (schema: ZodType, target: "body" | "query" | "params" = "body") => {

    return asyncHandler(async (req: Request,_res: Response,next: NextFunction) => {

        const data = req[target];
        const result = schema.safeParse(data);

        if(!result.success) {
            const errorDetails = result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
                code: issue.code
            }))
            const erroMessage = `Validation failed for ${target}: ${errorDetails.map(d => `${d.field}: ${d.message}`).join(', ')}`;
            return next(new ValidationError(erroMessage))
        }

        req[target] = result.data;
        return next();
        
    })
};

const validateBody = (schema: ZodType) => validate(schema, "body");
const validateQuery = (schema: ZodType) => validate(schema, "query");
const validateParams = (schema: ZodType) => validate(schema, "params");


export default validate;
export { 
    validateBody, 
    validateQuery, 
    validateParams 
};