import {Response} from "express";
import {IList} from "../models/List";
import {AuthRequest} from "../middleware/auth.middleware";
import {IBoardPlain, IListPlain, IUserPlain, toBoardPlain, toListPlain} from "../types";
import {errorResponse, successResponse} from "../utils/helpers/response.format";
import {
    createListService,
    deleteListWithCascadeService,
    getListsByBoardService,
    moveListService,
    updateListService
} from "../services/list.service";
import {IBoard} from "../models/Board";
import {userHasBoardAccess} from "../utils/helpers/access-controls";
import {getBoardByIdService} from "../services/board.service";
import {CreateListInput, MoveListInput, UpdateListInput} from "../validators/list.validators";

export const createList = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated: CreateListInput = req.validated;

        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({message: "User not found"}));
            return;
        }

        const board: IBoard | null = await getBoardByIdService({id: validated.boardId});
        if (!board) {
            res.status(404).json(errorResponse({message: "Board not found"}));
            return;
        }

        const checkAccess = await userHasBoardAccess({board, userId: user.id});
        if (!checkAccess) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this board"}));
            return;
        }

        const plainBoard: IBoardPlain = toBoardPlain(board);

        const list: IList = await createListService({input: validated, board: plainBoard});

        const plainList: IListPlain = toListPlain(list);

        res.status(201).json(successResponse({
            message: "List created successfully",
            data: plainList
        }));
    } catch (error: any) {
        console.log("Error creating list: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to create list",
            error: error.stack,
        }));
        return;
    }
};

export const updateList = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated: UpdateListInput = req.validated;

        const list: IList | undefined = req.listDoc;
        if (!list) {
            res.status(404).json(errorResponse({message: "List not found"}));
            return;
        }

        const updatedList: IList = await updateListService({
            input: validated,
            list,
        });

        const plainUpdatedList = toListPlain(updatedList);

        res.status(200).json(successResponse({
            message: "List updated successfully",
            data: plainUpdatedList
        }));
    } catch (error: any) {
        console.log("Error updating list: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to update list",
            error: error.stack,
        }));
        return;
    }
};

export const getListsByBoard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const board: IBoardPlain | undefined = req.board;
        if (!board) {
            res.status(404).json(errorResponse({message: "Board not found"}));
            return;
        }

        const lists = await getListsByBoardService({board});

        const plainLists: IListPlain[] = lists.map(toListPlain)

        res.status(200).json(successResponse({
            message: "Board lists fetched successfully",
            data: plainLists
        }));
    } catch (error: any) {
        console.log("Error fetching lists: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to fetch lists",
            error: error.stack,
        }));
        return;
    }
};

export const getListById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const list: IList | undefined = req.listDoc;
        if (!list) {
            res.status(404).json(errorResponse({message: "List not found"}));
            return;
        }

        // populate board with specific fields
        await list.populate([
            {path: 'board', select: '_id name'},
        ])

        const plainList = toListPlain(list);
        res.status(200).json(successResponse({
            message: "List fetched successfully",
            data: plainList
        }));
    } catch (error: any) {
        console.log("Error fetching list: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to fetch list",
            error: error.stack,
        }));
        return;
    }
};

export const deleteList = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const list: IList | undefined = req.listDoc;
        if (!list) {
            res.status(404).json(errorResponse({message: "List not found"}));
            return;
        }

        const plainList: IListPlain = toListPlain(list);
        await deleteListWithCascadeService({listId: plainList.id})

        res.status(200).json(successResponse({
            message: "List successfully deleted",
            data: null
        }));
    } catch (error: any) {
        console.log("Error deleting list: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to delete list",
            error: error.stack,
        }));
        return;
    }
};

export const moveList = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated: MoveListInput = req.validated;

        const list: IList | undefined = req.listDoc;
        if (!list) {
            res.status(404).json(errorResponse({message: "List not found"}));
            return;
        }

        const updatedList: IList = await moveListService({
            input: validated,
            list,
        });

        const plainUpdatedList = toListPlain(updatedList);

        res.status(200).json(successResponse({
            message: "List moved successfully",
            data: plainUpdatedList
        }));
    } catch (error: any) {
        console.log("Error moving list: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to move list",
            error: error.stack,
        }));
        return;
    }
};

