import api from "./axios.ts";
import type {IList} from "../models";
import {validateApiResponseData} from "../utils/validateApiResponseData.ts";
import {
    CreateListInputSchema,
    MoveListInputSchema,
    MultipleListsSchema,
    SingleListSchema,
    UpdateListInputSchema
} from "@/schemas";
import type {IAPIResponse} from "./types.ts";
import {validateObjectId} from "../utils/validate-object-id.ts";
import {callApi} from "./callApi.ts";
import type {AxiosResponse} from "axios";
import {validateApiResponseSuccess} from "../utils/validate-api-response-success.ts";
import {validateInput} from "../utils/validate-input.ts";

export const fetchListsByBoardIdAPI = async ({boardId}: { boardId: string }): Promise<IList[]> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedBoardId = validateObjectId(boardId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IList[]> = await callApi<IAPIResponse<IList[]>>((): Promise<AxiosResponse<IAPIResponse<IList[]>>> =>
        api.get<IAPIResponse<IList[]>>(`/lists/board/${validatedBoardId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    const lists: IList[] = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedLists = validateApiResponseData(lists, MultipleListsSchema);

    // Step 5: Return the validated data
    return validatedLists;
};

export const fetchSingleListByListIdAPI = async ({listId}: { listId: string }): Promise<IList> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedListId = validateObjectId(listId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IList> = await callApi<IAPIResponse<IList>>((): Promise<AxiosResponse<IAPIResponse<IList>>> =>
        api.get<IAPIResponse<IList>>(`/lists/${validatedListId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    const list: IList = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedList = validateApiResponseData(list, SingleListSchema);

    // Step 5: Return the validated data
    return validatedList;
};

export const createListAPI = async (
    {payload}: {
        payload: { name: string, boardId: string, position: number }
    }): Promise<IList> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedPayload = validateInput(CreateListInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IList> = await callApi<IAPIResponse<IList>>((): Promise<AxiosResponse<IAPIResponse<IList>>> =>
        api.post<IAPIResponse<IList>>(`/lists`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const list: IList = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedList = validateApiResponseData(list, SingleListSchema);

    // Step 5: Return the validated data
    return validatedList;
};

export const updateListAPI = async (
    {listId, payload}: {
        listId: string,
        payload: {
            name: string,
            position: number,
        }
    }): Promise<IList> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedListId = validateObjectId(listId)
    const validatedPayload = validateInput(UpdateListInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IList> = await callApi<IAPIResponse<IList>>((): Promise<AxiosResponse<IAPIResponse<IList>>> =>
        api.put<IAPIResponse<IList>>(`/lists/${validatedListId}`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const list: IList = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedList = validateApiResponseData(list, SingleListSchema);

    // Step 5: Return the validated data
    return validatedList;
};

export const moveListAPI = async (
    {listId, payload}: {
        listId: string,
        payload: {
            position: number,
        }
    }): Promise<IList> => {

    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedListId = validateObjectId(listId)
    const validatedPayload = validateInput(MoveListInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IList> = await callApi<IAPIResponse<IList>>((): Promise<AxiosResponse<IAPIResponse<IList>>> =>
        api.patch<IAPIResponse<IList>>(`/lists/${validatedListId}/move`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const list: IList = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedList = validateApiResponseData(list, SingleListSchema);

    // Step 5: Return the validated data
    return validatedList;
};

export const deleteListAPI = async ({listId}: { listId: string }) => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedListId = validateObjectId(listId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data = await callApi(() =>
        api.delete<IAPIResponse<void>>(`/lists/${validatedListId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    validateApiResponseSuccess(data, true);

    // Step 5: Return the validated id
    return validatedListId;
}