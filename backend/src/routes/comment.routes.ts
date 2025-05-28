import express from "express";
import {
    createComment,
    getCommentsByTask,
    deleteComment
} from "../controllers/comment.controller";
import {protect} from "../middleware/auth.middleware";
import {validate} from "../middleware/validate.middleware";
import {CreateCommentSchema} from "../validators/comment.validators";
import {modelBinder} from "../middleware/routeModelBinder.middleware";
import {toCommentPlain, toTaskPlain} from "../types";
import Task from "../models/Task";
import Comment from "../models/Comment";
import {
    authorizeCommentAuthorOrBoardOwnerForComment
} from "../middleware/authorizeCommentAuthorOrBoardOwnerForComment.middleware";
import {authorizeBoardMemberForTask} from "../middleware/authorizeBoardMemberForTask.middleware";

const router = express.Router();

router.post('/', protect, validate(CreateCommentSchema), createComment);

router.get("/task/:id",
    protect,
    modelBinder({
        param: "id",
        model: Task,
        key: "taskDoc",
        plainKey: "task",
        toPlain: toTaskPlain
    }),
    authorizeBoardMemberForTask,
    getCommentsByTask
)

router.delete("/:id",
    protect,
    modelBinder({
        param: "id",
        model: Comment,
        key: "commentDoc",
        plainKey: "comment",
        toPlain: toCommentPlain
    }),
    authorizeCommentAuthorOrBoardOwnerForComment,
    deleteComment
)

export default router;