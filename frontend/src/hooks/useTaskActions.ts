import {useAppDispatch, useAppSelector} from "@/hooks";
import toast from "react-hot-toast";
import {handleApiError} from "@/utils/handleApiError";
import type {ITask} from "@/models";
import type {FieldValues, UseFormSetError} from "react-hook-form";
import {useCallback} from "react";
import {
    createTask,
    deleteTask,
    fetchSingleTaskByTaskId,
    updateTask,
    fetchTasksByListId,
    moveTask,
} from "@/features/tasks/task.thunks.ts";

export const useTaskActions = <TFieldValues extends FieldValues = FieldValues>(
    setError?: UseFormSetError<TFieldValues>
): {
    createTask: typeof createTaskAction;
    deleteTask: typeof deleteTaskAction;
    updateTask: typeof updateTaskAction;
    moveTask: typeof moveTaskAction;
    fetchTask: typeof fetchTaskAction;
    fetchAllTasks: typeof fetchAllTasksAction;
} => {
    const dispatch = useAppDispatch();

    const createTaskAction = useCallback(async (
        title: string,
        description: string,
        listId: string,
        position: number,
        dueDate: string,
        priority: string
    ) => {
        try {
            const newTask: ITask = await dispatch(createTask({
                title,
                description,
                listId,
                position,
                dueDate,
                priority
            })).unwrap();
            toast.success("Task created successfully.");
            return {success: true, data: newTask};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const deleteTaskAction = useCallback(async (taskId: string) => {
        try {
            await dispatch(deleteTask({taskId})).unwrap();
            toast.success("Task deleted successfully.");
            return {success: true};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const updateTaskAction = useCallback(async (
        taskId: string,
        title: string,
        description: string,
        listId: string,
        position: number,
        dueDate: string,
        priority: string
    ) => {
        try {
            const updatedTask = await dispatch(updateTask({
                taskId, payload: {
                    title,
                    description,
                    listId,
                    position,
                    dueDate,
                    priority
                }
            })).unwrap();
            toast.success("Task updated successfully.");
            return {success: true, data: updatedTask};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const moveTaskAction = useCallback(async (
        taskId: string,
        listId: string,
        position: number,
    ) => {
        try {
            const movedTask = await dispatch(moveTask({
                taskId, payload: {
                    listId,
                    position,
                }
            })).unwrap();
            toast.success("Task moved successfully.");
            return {success: true, data: movedTask};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const fetchTaskAction = useCallback(async (taskId: string) => {
        try {
            const task = await dispatch(fetchSingleTaskByTaskId({taskId})).unwrap();
            return {success: true, data: task};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const fetchAllTasksAction = useCallback(async (listId: string) => {
        try {
            const tasks = await dispatch(fetchTasksByListId({listId})).unwrap();
            return {success: true, data: tasks};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    return {
        createTask: createTaskAction,
        deleteTask: deleteTaskAction,
        updateTask: updateTaskAction,
        moveTask: moveTaskAction,
        fetchTask: fetchTaskAction,
        fetchAllTasks: fetchAllTasksAction,
    };
};

export const useTaskState = () => {
    return useAppSelector((state) => state.tasks);
};

export const useTasks = (listId?: string): ITask[] => {
    const {tasksByList} = useTaskState();
    if (!listId) return [];
    return tasksByList[listId] ?? [];
};

export const useTasksLoading = (): boolean =>
    useAppSelector((state) => state.tasks.fetching);

export const useTasksError = (): string | null =>
    useAppSelector((state) => state.tasks.fetchError);
