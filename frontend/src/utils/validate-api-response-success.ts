import type {IAPIResponse} from "../api/types";
import {createBadRequestError} from "./api-errors";
import type {ValidationErrorDetail} from "./api-errors";

/**
 * Validates an API response that should follow the IAPIResponse<T> structure.
 * Ensures success is true and data is present, otherwise throws APIError.
 */


export function validateApiResponseSuccess<T>(apiResponse: IAPIResponse<T>, isDeleteResponse: boolean = false): T {
    if (!apiResponse.success) {
        let details: ValidationErrorDetail[] | undefined = undefined;

        if (apiResponse.errors && typeof apiResponse.errors === "object" && !Array.isArray(apiResponse.errors)) {
            // Normalize object-based errors
            details = Object.entries(apiResponse.errors).flatMap(([field, messages]) =>
                (Array.isArray(messages) ? messages : [String(messages)]).map((msg) => ({
                    path: [field],
                    message: msg,
                }))
            );
        } else if (Array.isArray(apiResponse.errors)) {
            // Already an array of ValidationErrorDetail[]
            details = apiResponse.errors as ValidationErrorDetail[];
        }

        throw createBadRequestError(
            apiResponse.message ?? apiResponse.error ?? "Unknown API error",
            details
        );
    }

    if (!isDeleteResponse && (apiResponse.data === undefined || apiResponse.data === null)) {
        throw createBadRequestError("API response marked success, but data is missing");
    }

    return apiResponse.data as T;
}



