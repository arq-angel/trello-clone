import {Request, Response, NextFunction, ErrorRequestHandler} from "express";
import {AppError, ValidationError} from "../utils/helpers/app-errors";
import {IAppError, IValidationError} from "../types/app.error";

export const globalErrorHandler: ErrorRequestHandler = (
    err: IAppError | IValidationError,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    // Locally display the error in the terminal for debug purposes
    console.error('Error stack:', err.stack);
    console.error('Request info:', {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
        user: req.user, // if you attach a user in auth middleware
    });


    // include the error message if it's dev environment
    const isDev = process.env.NODE_ENV === "development";

    // Check ValidationError first, because it extends AppError
    if (err instanceof ValidationError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            error: isDev ? err.stack ?? undefined : undefined,
        });
        return;
    }

    // If it's an instance of AppError, use its values
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: isDev ? err.stack : undefined
        });
        return;
    }

    // Otherwise, return generic 500
    console.error('Unexpected Error:', err);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: isDev ? err.stack : undefined
    });
}
