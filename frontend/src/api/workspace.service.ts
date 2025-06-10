import api from "./axios.ts";
import type {IWorkspace} from "../models";
import {
    CreateWorkspaceInputSchema,
    MultipleWorkspacesSchema,
    SingleWorkspaceSchema,
    UpdateWorkspaceInputSchema
} from "../schemas";
import {validateApiResponseData} from "../utils/validateApiResponseData.ts";
import type {IAPIResponse} from "./types.ts";
import {callApi} from "./callApi.ts";
import type {AxiosResponse} from "axios";
import {validateApiResponseSuccess} from "../utils/validate-api-response-success.ts";
import {validateInput} from "../utils/validate-input.ts";
import {validateObjectId} from "../utils/validate-object-id.ts";

export const fetchAllWorkspacesAPI = async (): Promise<IWorkspace[]> => {
    // Step 1: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IWorkspace[]> = await callApi<IAPIResponse<IWorkspace[]>>((): Promise<AxiosResponse<IAPIResponse<IWorkspace[]>>> =>
        api.get<IAPIResponse<IWorkspace[]>>(`/workspaces`)
    );

    // Step 2: Check if API response success flag is true and extract data
    const workspaces: IWorkspace[] = validateApiResponseSuccess(data);

    // Step 3: Validate the actual data payload matches expected schema
    const validatedWorkspaces = validateApiResponseData(workspaces, MultipleWorkspacesSchema);

    // Step 4: Return the validated data
    return validatedWorkspaces;
};

export const fetchSingleWorkspaceByWorkspaceIdAPI = async (
    {workspaceId}: { workspaceId: string }
): Promise<IWorkspace> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedWorkspaceId = validateObjectId(workspaceId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IWorkspace> = await callApi<IAPIResponse<IWorkspace>>((): Promise<AxiosResponse<IAPIResponse<IWorkspace>>> =>
        api.get<IAPIResponse<IWorkspace>>(`/workspaces/${validatedWorkspaceId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    const workspace: IWorkspace = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedWorkspace = validateApiResponseData(workspace, SingleWorkspaceSchema);

    // Step 5: Return the validated data
    return validatedWorkspace;
};

export const createWorkspaceAPI = async (
    {payload}: { payload: { name: string } }
): Promise<IWorkspace> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedPayload = validateInput(CreateWorkspaceInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IWorkspace> = await callApi<IAPIResponse<IWorkspace>>((): Promise<AxiosResponse<IAPIResponse<IWorkspace>>> =>
        api.post<IAPIResponse<IWorkspace>>(`/workspaces`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const workspace: IWorkspace = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedWorkspace = validateApiResponseData(workspace, SingleWorkspaceSchema);

    // Step 5: Return the validated data
    return validatedWorkspace;
};

export const updateWorkspaceAPI = async (
    {workspaceId, payload}: { workspaceId: string, payload: { name: string } }
): Promise<IWorkspace> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedWorkspaceId = validateObjectId(workspaceId)
    const validatedPayload = validateInput(UpdateWorkspaceInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<IWorkspace> = await callApi<IAPIResponse<IWorkspace>>((): Promise<AxiosResponse<IAPIResponse<IWorkspace>>> =>
        api.put<IAPIResponse<IWorkspace>>(`/workspaces/${validatedWorkspaceId}`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const workspace: IWorkspace = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedWorkspace = validateApiResponseData(workspace, SingleWorkspaceSchema);

    // Step 5: Return the validated data
    return validatedWorkspace;
};

export const deleteWorkspaceAPI = async (
    {workspaceId}: { workspaceId: string }
): Promise<string> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedWorkspaceId = validateObjectId(workspaceId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data = await callApi(() =>
        api.delete<IAPIResponse<void>>(`/workspaces/${validatedWorkspaceId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    validateApiResponseSuccess(data, true);

    // Step 5: Return the validated id
    return validatedWorkspaceId;
}