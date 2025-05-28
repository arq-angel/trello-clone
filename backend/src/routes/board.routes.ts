import express = require('express');
import {
    createBoard,
    updateBoard,
    getMyBoards,
    deleteBoard,
    getBoardById
} from "../controllers/board.controller";
import {protect} from "../middleware/auth.middleware";
import {validate} from "../middleware/validate.middleware";
import {CreateBoardSchema, UpdateBoardSchema} from "../validators/boards.validators";
import {modelBinder} from "../middleware/routeModelBinder.middleware";
import Board from "../models/Board";
import {toBoardPlain} from "../types";
import {authorizeBoardMember} from "../middleware/authorizeBoardMember.middleware";
import {authorizeBoardOwner} from "../middleware/authorizeBoardOwner.middleware";

const router = express.Router();

router.route("/")
    .post(protect, validate(CreateBoardSchema), createBoard)
    .get(protect, getMyBoards);

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