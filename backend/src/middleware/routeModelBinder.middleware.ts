import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import mongoose, {Model} from "mongoose";

interface ModelBinderOptions<T> {
    param: string;                // route param name, e.g. "boardId"
    model: Model<T>;              // Mongoose model
    key: keyof AuthRequest;       // where to attach the document, e.g. "boardDoc"
    plainKey?: keyof AuthRequest; // optional plain version key, e.g. "board"
    toPlain?: (doc: T) => any;    // optional function to convert to plain object
}

export const modelBinder = <T>({param, model, key, plainKey, toPlain}: ModelBinderOptions<T>) =>
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string = req.params[param];
            if (!id) {
                res.status(400).json(errorResponse({
                    message: `Missing parameter ${param}`
                }));
                return;
            }

            if (!mongoose.isValidObjectId(id)) {
                res.status(400).json(errorResponse({message: `Invalid ${model} ID format`}));
                return;
            }

            const doc = await model.findById(id);
            if (!doc) {
                const capitalizeFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
                res.status(404).json(errorResponse({
                    message: `${capitalizeFirst(model.modelName)} not found`
                }));
                return;
            }

            (req as any)[key] = doc;

            if (plainKey && toPlain) {
                (req as any)[plainKey] = toPlain(doc);
            }

            next();

        } catch (error: any) {
            console.error(`Error in modelBinder for param '${param}': `, error);
            res.status(500).json(errorResponse({
                message: `Failed to bind ${param}`,
                error: error.stack,
            }))
        }
    }