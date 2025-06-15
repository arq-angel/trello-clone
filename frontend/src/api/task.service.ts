import type {ITask} from "../models";
import api from "./axios.ts";
import {validateApiResponseData} from "../utils/validateApiResponseData.ts";
import {
    CreateTaskInputSchema, MoveTaskInputSchema,
    MultipleTasksSchema,
    SingleTaskSchema,
    UpdateTaskInputSchema
} from "../schemas";
import type {IAPIResponse} from "./types.ts";
import {validateObjectId} from "../utils/validate-object-id.ts";
import {callApi} from "./callApi.ts";
import type {AxiosResponse} from "axios";
import {validateApiResponseSuccess} from "../utils/validate-api-response-success.ts";
import {validateInput} from "../utils/validate-input.ts";

export const fetchTasksByListIdAPI = async ({listId}: { listId: string }): Promise<ITask[]> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedListId = validateObjectId(listId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<ITask[]> = await callApi<IAPIResponse<ITask[]>>((): Promise<AxiosResponse<IAPIResponse<ITask[]>>> =>
        api.get<IAPIResponse<ITask[]>>(`/tasks/list/${validatedListId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    const tasks: ITask[] = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedTasks = validateApiResponseData(tasks, MultipleTasksSchema);

    // Step 5: Return the validated data
    return validatedTasks;
};

export const fetchSingleTaskByTaskIdAPI = async ({taskId}: { taskId: string }): Promise<ITask> => {

    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedTaskId = validateObjectId(taskId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<ITask> = await callApi<IAPIResponse<ITask>>((): Promise<AxiosResponse<IAPIResponse<ITask>>> =>
        api.get<IAPIResponse<ITask>>(`/tasks/${validatedTaskId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    const task: ITask = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedTask = validateApiResponseData(task, SingleTaskSchema);

    // Step 5: Return the validated data
    return validatedTask;
};

export const createTaskAPI = async (
    {payload}: {
        payload: {
            title: string,
            description: string,
            listId: string,
            position: number,
            dueDate: string,
            priority: string
        }
    }): Promise<ITask> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedPayload = validateInput(CreateTaskInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<ITask> = await callApi<IAPIResponse<ITask>>((): Promise<AxiosResponse<IAPIResponse<ITask>>> =>
        api.post<IAPIResponse<ITask>>(`/tasks`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const task: ITask = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedTask = validateApiResponseData(task, SingleTaskSchema);

    // Step 5: Return the validated data
    return validatedTask;
};

export const updateTaskAPI = async (
    {taskId, payload}: {
        taskId: string,
        payload: {
            title: string,
            description: string,
            listId: string,
            position: number,
            dueDate: string,
            priority: string
        }
    }): Promise<ITask> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedTaskId = validateObjectId(taskId)
    const validatedPayload = validateInput(UpdateTaskInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<ITask> = await callApi<IAPIResponse<ITask>>((): Promise<AxiosResponse<IAPIResponse<ITask>>> =>
        api.put<IAPIResponse<ITask>>(`/tasks/${validatedTaskId}`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const task: ITask = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedTask = validateApiResponseData(task, SingleTaskSchema);

    // Step 5: Return the validated data
    return validatedTask;
};

export const moveTaskAPI = async (
    {taskId, payload}: {
        taskId: string,
        payload: {
            position: number,
        }
    }): Promise<ITask> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedTaskId = validateObjectId(taskId)
    const validatedPayload = validateInput(MoveTaskInputSchema, payload)

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<ITask> = await callApi<IAPIResponse<ITask>>((): Promise<AxiosResponse<IAPIResponse<ITask>>> =>
        api.patch<IAPIResponse<ITask>>(`/tasks/${validatedTaskId}/move`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const list: ITask = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedTask = validateApiResponseData(list, SingleTaskSchema);

    // Step 5: Return the validated data
    return validatedTask;
};

export const deleteTaskAPI = async ({taskId}: { taskId: string }) => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedTaskId = validateObjectId(taskId)

    // Step 2: Call backend API using centralized axios call wrapper
    const data = await callApi(() =>
        api.delete<IAPIResponse<void>>(`/tasks/${validatedTaskId}`)
    );

    // Step 3: Check if API response success flag is true and extract data
    validateApiResponseSuccess(data, true);

    // Step 5: Return the validated id
    return validatedTaskId;
}