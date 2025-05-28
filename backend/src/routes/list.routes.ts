import express from "express";
import {
    createList,
    updateList,
    getListsByBoard,
    getListById,
    deleteList, moveList
} from "../controllers/list.controller";
import {protect} from "../middleware/auth.middleware";
import Board from "../models/Board";
import {modelBinder} from "../middleware/routeModelBinder.middleware";
import {toBoardPlain, toListPlain} from "../types";
import {authorizeBoardMember} from "../middleware/authorizeBoardMember.middleware";
import {validate} from "../middleware/validate.middleware";
import {CreateListSchema, MoveListSchema, UpdateListSchema} from "../validators/list.validators";
import List from "../models/List";
import {authorizeBoardMemberForList} from "../middleware/authorizeBoardMemberForList.middleware";
import {authorizeBoardOwnerForList} from "../middleware/authorizeBoardOwnerForList.middleware";

const router = express.Router();

router.post("/", protect, validate(CreateListSchema), createList);

router.get('/board/:boardId',
    protect,
    modelBinder({
        param: "boardId",
        model: Board,
        key: "boardDoc",
        plainKey: "board",
        toPlain: toBoardPlain
    }),
    authorizeBoardMember,
    getListsByBoard
);

router.route("/:id")
    .get(
        protect,
        modelBinder({
            param: "id",
            model: List,
            key: "listDoc",
            plainKey: "list",
            toPlain: toListPlain
        }),
        authorizeBoardMemberForList,
        getListById
    )
    .put(
        protect,
        modelBinder({
            param: "id",
            model: List,
            key: "listDoc",
            plainKey: "list",
            toPlain: toListPlain
        }),
        authorizeBoardMemberForList,
        validate(UpdateListSchema),
        updateList
    )
    .delete(
        protect,
        modelBinder({
            param: "id",
            model: List,
            key: "listDoc",
            plainKey: "list",
            toPlain: toListPlain
        }),
        authorizeBoardOwnerForList,
        deleteList
    );

router.patch("/:id/move",
    protect,
    modelBinder({
        param: "id",
        model: List,
        key: "listDoc",
        plainKey: "list",
        toPlain: toListPlain
    }),
    authorizeBoardMemberForList,
    validate(MoveListSchema),
    moveList
)

export default router;