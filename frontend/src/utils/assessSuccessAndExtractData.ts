import type {IAPIResponse} from "../api/types.ts";

export function assessSuccessAndExtractData<T>(response: IAPIResponse<T>): T {
    // assess the success flag
    if (!response.success) {
        throw new Error(response.message ?? response.error ?? "Unknown API error");
    }

    // assess the data
    if (response.data === undefined) {
        throw new Error("API response marked success, but data is missing");
    }

    // Return the extracted data
    return response.data;
}

