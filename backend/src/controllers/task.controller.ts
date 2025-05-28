import {Response} from 'express';
import {ITask} from "../models/Task";
import {AuthRequest} from "../middleware/auth.middleware";
import {IList} from "../models/List";
import {IListPlain, ITaskMoved, ITaskPlain, IUserPlain, toListPlain, toTaskPlain} from "../types";
import {getListByIdService} from "../services/list.service";
import {CreateTaskInput, MoveTaskInput, UpdateTaskInput} from "../validators/task.validators";
import {createTaskService, getTasksByListService, moveTaskService, updatedTaskService} from "../services/task.service";
import {errorResponse, successResponse} from "../utils/helpers/response.format";
import {userHasListAccess} from "../utils/helpers/access-controls";

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated: CreateTaskInput = req.validated;

        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({message: "User not found"}));
            return;
        }

        const list: IList | null = await getListByIdService({id: validated.listId});
        if (!list) {
            res.status(404).json(errorResponse({message: "List not found"}));
            return;
        }

        const checkAccess = await userHasListAccess({list, userId: user.id});
        if (!checkAccess) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this list"}));
            return;
        }

        const plainList: IListPlain = toListPlain(list);

        const task = await createTaskService({
            input: validated,
            list: plainList,
        });

        const plainTask = toTaskPlain(task);

        res.status(201).json(successResponse({
            message: "Task created successfully",
            data: plainTask,
        }));
    } catch (error) {
        console.log("Error creating task: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to create task",
            error: error.stack,
        }));
    }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated: UpdateTaskInput = req.validated;

        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({message: "User not found"}));
            return;
        }

        const task: ITask | undefined = req.taskDoc;
        if (!task) {
            res.status(404).json(errorResponse({message: "Task not found"}));
            return;
        }

        const list: IList | null = await getListByIdService({id: validated.listId});
        if (!list) {
            res.status(404).json(errorResponse({message: "List not found"}));
            return;
        }

        const checkAccess = await userHasListAccess({list, userId: user.id});
        if (!checkAccess) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this list"}));
            return;
        }

        const plainList: IListPlain = toListPlain(list);

        const updatedTask: ITask = await updatedTaskService({
            input: validated,
            task,
            list: plainList,
        });

        const plainUpdatedTask: ITaskPlain = toTaskPlain(updatedTask);

        res.status(200).json(successResponse({
            message: "Task updated successfully",
            data: plainUpdatedTask,
        }));
    } catch (error) {
        console.log("Error updating task: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to update task",
            error: error.stack,
        }));
    }
};

export const getTasksByList = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const list: IListPlain | undefined = req.list;
        if (!list) {
            res.status(404).json(errorResponse({message: "List not found"}));
            return;
        }

        const tasks = await getTasksByListService({list});

        const plainTasks: ITaskPlain[] = tasks.map(toTaskPlain);

        res.status(200).json(successResponse({
            message: "List tasks fetched successfully",
            data: plainTasks,
        }));
    } catch (error) {
        console.log("Error fetching tasks: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to fetch tasks",
            error: error.stack,
        }));
    }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const task: ITask | undefined = req.taskDoc;
        if (!task) {
            res.status(404).json(errorResponse({message: "Task not found"}));
            return;
        }

        // populate task with specific fields
        await task.populate([
            {path: "list", select: "_id name"},
        ])

        const plainTask = toTaskPlain(task);
        res.status(200).json({
            message: "Task fetched successfully",
            data: plainTask,
        });
    } catch (error) {
        console.log("Error fetching task: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to fetch task",
            error: error.stack,
        }));
        return;
    }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const task: ITask | undefined = req.taskDoc;
        if (!task) {
            res.status(404).json(errorResponse({message: "Task not found"}));
            return;
        }

        await task.deleteOne();

        res.status(200).json(successResponse({
            message: "Task deleted successfully",
            data: null
        }));
    } catch (error) {
        console.log("Error updating task: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to delete task",
            error: error.stack,
        }));
    }
};

// here update and move task are pretty much the same just different routes
// might change in the future implementations
export const moveTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated: MoveTaskInput = req.validated;

        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({message: "User not found"}));
            return;
        }

        const task: ITask | undefined = req.taskDoc;
        if (!task) {
            res.status(404).json(errorResponse({message: "Task not found"}));
            return;
        }

        const list: IList | null = await getListByIdService({id: validated.listId});
        if (!list) {
            res.status(404).json(errorResponse({message: "List not found"}));
            return;
        }

        const checkAccess = await userHasListAccess({list, userId: user.id});
        if (!checkAccess) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this list"}));
            return;
        }

        const plainList: IListPlain = toListPlain(list);

        const movedTask: ITask = await moveTaskService({
            input: validated,
            task,
            list: plainList,
        });

        const plainMovedTask: ITaskMoved = toTaskPlain(movedTask);

        res.status(200).json(successResponse({
            message: "Task moved successfully",
            data: plainMovedTask,
        }));
    } catch (error) {
        console.log("Error moving task: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to move task",
            error: error.stack,
        }));
    }
};