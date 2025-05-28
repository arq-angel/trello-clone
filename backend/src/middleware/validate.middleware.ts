import {Request, Response, NextFunction} from "express";
import {ZodSchema, ZodError} from "zod";

export const validate =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                const error = result.error as ZodError;

                const fieldErrors = error.flatten().fieldErrors;

                // don't change this into errorResponse helper function
                // different ways of handling errors
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: fieldErrors,
                });
                return;
            }

            req.validated = result.data;
            next();
        };
