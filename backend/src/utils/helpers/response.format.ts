interface ErrorResponseParams {
    message?: string;
    error?: unknown;
}

interface ErrorResponseResult {
    success: boolean;
    message: string;
    error?: unknown;
}

interface SuccessResponseParams<T = unknown> {
    message?: string;
    data?: T;
}

interface SuccessResponseResult<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

export const errorResponse = ({message, error}: ErrorResponseParams): ErrorResponseResult => {
    const isDevelopment = process.env.NODE_ENV === "development";
    const genericMessage = "An unexpected error occurred. Please try again later.";

    const response = {
        success: false,
        message: message ?? genericMessage,
        ...(isDevelopment && error !== undefined ? {error} : {}),
    }

    console.error("Error response: ", response)

    return response;
};

export const successResponse = <T>({message, data,}: SuccessResponseParams<T>): SuccessResponseResult<T> => {
    const genericMessage = "Action performed successfully.";

    const response = {
        success: true,
        message: message ?? genericMessage,
        ...(data !== undefined && data !== null ? {data} : {})
    }

    console.log("Success response: ", response)

    return response;
};
