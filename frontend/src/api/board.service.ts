import type {IBoard} from "../models";
import api from "./axios.ts";
import {validateApiResponseData} from "../utils/validateApiResponseData.ts";
import {
    CreateBoardInputSchema,
    MultipleBoardsSchema,
    SingleBoardSchema,
    UpdateBoardInputSchema,
} from "../schemas";
import type {IAPIResponse} from "./types.ts";
import {callApi} from "./callApi.ts";
import {validateApiResponseSuccess} from "../utils/validate-api-response-success.ts";
import type {AxiosResponse} from "axios";
import {validateObjectId} from "../utils/validate-object-id.ts";
import {validateInput} from "../utils/validate-input.ts";

export const fetchBoardsByWorkspaceIdAPI = async ({workspaceId}: { workspaceId: string }): Promise<IBoard[]> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedWorkspaceId = validateObjectId(workspaceId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IBoard[]> = await callApi<IAPIResponse<IBoard[]>>((): Promise<AxiosResponse<IAPIResponse<IBoard[]>>> =>
        api.get<IAPIResponse<IBoard[]>>(`/boards/workspace/${validatedWorkspaceId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    const boards: IBoard[] = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedBoards = validateApiResponseData(boards, MultipleBoardsSchema);

    // Step 5: Return the validated data
    return validatedBoards;
};

export const fetchSingleBoardByBoardIdAPI = async ({boardId}: { boardId: string }): Promise<IBoard> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedBoardId = validateObjectId(boardId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IBoard> = await callApi<IAPIResponse<IBoard>>((): Promise<AxiosResponse<IAPIResponse<IBoard>>> =>
        api.get<IAPIResponse<IBoard>>(`/boards/${validatedBoardId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    const board: IBoard = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedBoard = validateApiResponseData(board, SingleBoardSchema);

    // Step 5: Return the validated data
    return validatedBoard;
};

export const createBoardAPI = async (
    {payload}: {
        payload: {
            name: string,
            workspaceId: string
        }
    }): Promise<IBoard> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedPayload = validateInput(CreateBoardInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IBoard> = await callApi<IAPIResponse<IBoard>>((): Promise<AxiosResponse<IAPIResponse<IBoard>>> =>
        api.post<IAPIResponse<IBoard>>(`/boards`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const board: IBoard = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedBoard = validateApiResponseData(board, SingleBoardSchema);

    // Step 5: Return the validated data
    return validatedBoard;
};

export const updateBoardAPI = async (
    {boardId, payload}: {
        boardId: string,
        payload: {
            name: string,
            workspaceId: string
        }
    }): Promise<IBoard> => {

    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedBoardId = validateObjectId(boardId)
    const validatedPayload = validateInput(UpdateBoardInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IBoard> = await callApi<IAPIResponse<IBoard>>((): Promise<AxiosResponse<IAPIResponse<IBoard>>> =>
        api.put<IAPIResponse<IBoard>>(`/boards/${validatedBoardId}`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const board: IBoard = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedBoard = validateApiResponseData(board, SingleBoardSchema);

    // Step 5: Return the validated data
    return validatedBoard;
};

export const deleteBoardAPI = async ({boardId}: { boardId: string }) => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedBoardId = validateObjectId(boardId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data = await callApi(() =>
        api.delete<IAPIResponse<void>>(`/boards/${validatedBoardId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    validateApiResponseSuccess(data, true);

    // Step 5: Return the validated id
    return validatedBoardId;
}