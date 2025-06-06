// Success response: must have success=true, message, and data (non-optional)
export interface ISuccessApiResponse<T> {
    success: true;
    message: string;
    data: T;
    error?: never;  // error should NOT exist here
}

// Error response: success=false or undefined, may have message and error, no data
export interface IErrorApiResponse {
    success?: false;
    message?: string;
    error?: string;
    errors?: unknown[]; // make this flexible
    data?: never;   // no data on error responses
    [key: string]: unknown; // to allow extra fields if any
}

// Delete success response: must have success=true and message only
export interface IDeleteSuccessApiResponse {
    success: true;
    message?: string;
    data?: never; // data should NOT exist here
    error?: never;  // error should NOT exist here
}

// General API response type that is either success or error
export type IAPIResponse<T> = ISuccessApiResponse<T> | IErrorApiResponse | IDeleteSuccessApiResponse;
