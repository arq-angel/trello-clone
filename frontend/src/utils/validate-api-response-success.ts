import type {IAPIResponse} from "../api/types.ts";
import {createBadRequestError} from "./api-errors.ts"; // adjust path if needed

export function assessApiResponse<T>(responseFromAxios: IAPIResponse<T>): T {
    if (!responseFromAxios.success) {
        // Throw APIError with message and details (if any)
        throw createBadRequestError(
            responseFromAxios.message ?? responseFromAxios.error ?? "Unknown API error",
            responseFromAxios.errors
        );
    }

    if (responseFromAxios.data === undefined) {
        // Missing data despite success = true, throw error
        throw createBadRequestError("API response marked success, but data is missing");
    }

    return responseFromAxios.data;
}
