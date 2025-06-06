import axios from "axios";
import {APIError, type ValidationErrorDetail} from "../utils/api-errors";

export async function callApi<T>(apiCall: () => Promise<{ data: T }>): Promise<T> {
    try {
        const response = await apiCall();
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const data = err.response?.data;

            let details: ValidationErrorDetail[] | undefined;

            if (data?.errors && typeof data.errors === "object") {
                details = Object.entries(data.errors).flatMap(([field, messages]) =>
                    Array.isArray(messages)
                        ? messages.map(msg => ({ path: [field], message: msg }))
                        : []
                );
            }

            // Throw your APIError with message, status, details
            throw new APIError(
                data?.message ?? "API Error",
                err.response?.status ?? 500,
                details,
                "server"
            );
        }

        // fallback unknown error
        throw new APIError("Unknown error", 500, undefined, "unknown");
    }}