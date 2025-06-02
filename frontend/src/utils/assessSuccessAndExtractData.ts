// utils/extractSuccessData.ts
interface SuccessApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const extractData = <T>(response: SuccessApiResponse<T>): T => {
    if (!response.success) {
        throw new Error(response.message ?? `Error occurred while fetching data.`);
    }
    return response.data;
};
