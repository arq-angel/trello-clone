import api from "./axios.ts";
import type {IComment} from "../models";
import {validateApiResponseData} from "../utils/validateApiResponseData.ts";
import {
    CreateCommentInputSchema,
    MultipleCommentsSchema,
    SingleCommentSchema
} from "../schemas";
import type {IAPIResponse} from "./types.ts";
import {validateObjectId} from "../utils/validate-object-id.ts";
import {callApi} from "./callApi.ts";
import type {AxiosResponse} from "axios";
import {validateApiResponseSuccess} from "../utils/validate-api-response-success.ts";
import {validateInput} from "../utils/validate-input.ts";

export const fetchCommentsByTaskIdAPI = async ({taskId}: { taskId: string }): Promise<IComment[]> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedTaskId = validateObjectId(taskId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IComment[]> = await callApi<IAPIResponse<IComment[]>>((): Promise<AxiosResponse<IAPIResponse<IComment[]>>> =>
        api.get<IAPIResponse<IComment[]>>(`/comments/task/${validatedTaskId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    const comments: IComment[] = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedComments = validateApiResponseData(comments, MultipleCommentsSchema);

    // Step 5: Return the validated data
    return validatedComments;
};

export const createCommentAPI = async ({payload}: { payload: { text: string, taskId: string } }): Promise<IComment> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedPayload = validateInput(CreateCommentInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IComment> = await callApi<IAPIResponse<IComment>>((): Promise<AxiosResponse<IAPIResponse<IComment>>> =>
        api.post<IAPIResponse<IComment>>(`/comments`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const comment: IComment = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedComment = validateApiResponseData(comment, SingleCommentSchema);

    // Step 5: Return the validated data
    return validatedComment;
};

export const deleteCommentAPI = async ({commentId}: { commentId: string }) => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedCommentId = validateObjectId(commentId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data = await callApi(() =>
        api.delete<IAPIResponse<void>>(`/comments/${validatedCommentId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    validateApiResponseSuccess(data, true);

    // Step 5: Return the validated id
    return validatedCommentId;
}