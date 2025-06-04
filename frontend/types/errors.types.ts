export interface ApiValidationError {
    path: (string | number)[];
    message: string;
}

export interface ApiErrorResponse {
    success?: false;
    message: string;
    errors?: ApiValidationError[];
    source?: "client" | "server";
}
