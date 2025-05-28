import express from "express";
import {
    createTask,
    getTasksByList,
    updateTask,
    deleteTask,
    moveTask,
    getTaskById
} from "../controllers/task.controller";
import {protect} from "../middleware/auth.middleware";
import {validate} from "../middleware/validate.middleware";
import {CreateTaskSchema, MoveTaskSchema, UpdateTaskSchema} from "../validators/task.validators";
import {modelBinder} from "../middleware/routeModelBinder.middleware";
import {toListPlain, toTaskPlain} from "../types";
import List from "../models/List";
import Task from "../models/Task";
import {authorizeBoardMemberForList} from "../middleware/authorizeBoardMemberForList.middleware";
import {authorizeBoardMemberForTask} from "../middleware/authorizeBoardMemberForTask.middleware";
import {authorizeBoardOwnerForTask} from "../middleware/authorizeBoardOwnerForTask.middleware";

const router = express.Router();

router.post("/", protect, validate(CreateTaskSchema), createTask);

router.get("/list/:listId",
    protect,
    modelBinder({
        param: "listId",
        model: List,
        key: "listDoc",
        plainKey: "list",
        toPlain: toListPlain
    }),
    authorizeBoardMemberForList,
    getTasksByList
);

router.route("/:id")
    .get(
        protect,
        modelBinder({
            param: "id",
            model: Task,
            key: "taskDoc",
            plainKey: "task",
            toPlain: toTaskPlain
        }),
        authorizeBoardMemberForTask,
        getTaskById
    )
    .put(
        protect,
        modelBinder({
            param: "id",
            model: Task,
            key: "taskDoc",
            plainKey: "task",
            toPlain: toTaskPlain
        }),
        authorizeBoardMemberForTask,
        validate(UpdateTaskSchema),
        updateTask
    )
    .delete(
        protect,
        modelBinder({
            param: "id",
            model: Task,
            key: "taskDoc",
            plainKey: "task",
            toPlain: toTaskPlain
        }),
        authorizeBoardOwnerForTask,
        deleteTask
    );

router.patch('/:id/move',
    protect,
    modelBinder({
        param: "id",
        model: Task,
        key: "taskDoc",
        plainKey: "task",
        toPlain: toTaskPlain
    }),
    authorizeBoardMemberForTask,
    validate(MoveTaskSchema),
    moveTask
);

export default router;