import express = require('express');
import {
    createBoard,
    updateBoard,
    getBoardsByWorkspace,
    deleteBoard,
    getBoardById
} from "../controllers/board.controller";
import {protect} from "../middleware/auth.middleware";
import {validate} from "../middleware/validate.middleware";
import {CreateBoardSchema, UpdateBoardSchema} from "../validators/boards.validators";
import {modelBinder} from "../middleware/routeModelBinder.middleware";
import Board from "../models/Board";
import {toBoardPlain, toWorkspacePlain} from "../types";
import {authorizeBoardMember} from "../middleware/authorizeBoardMember.middleware";
import {authorizeBoardOwner} from "../middleware/authorizeBoardOwner.middleware";
import {authorizeWorkspaceMember} from "../middleware/authorizeWorkspaceMember.middleware";
import Workspace from "../models/Workspace";

const router = express.Router();

router.route("/").post(protect, validate(CreateBoardSchema), createBoard);

router.get('/workspace/:workspaceId',
    protect,
    modelBinder({
        param: "workspaceId",
        model: Workspace,
        key: "workspaceDoc",
        plainKey: "workspace",
        toPlain: toWorkspacePlain
    }),
    authorizeWorkspaceMember,
    getBoardsByWorkspace,
);

router.route("/:id")
    .get(
        protect,
        modelBinder({
            param: "id",
            model: Board,
            key: "boardDoc",
            plainKey: "board",
            toPlain: toBoardPlain,
        }),
        authorizeBoardMember,
        getBoardById
    )
    .put(
        protect,
        modelBinder({
            param: "id",
            model: Board,
            key: "boardDoc",
            plainKey: "board",
            toPlain: toBoardPlain,
        }),
        authorizeBoardOwner,
        validate(UpdateBoardSchema),
        updateBoard
    )
    .delete(
        protect,
        modelBinder({
            param: "id",
            model: Board,
            key: "boardDoc",
            plainKey: "board",
            toPlain: toBoardPlain,
        }),
        authorizeBoardOwner,
        deleteBoard
    );

export default router;