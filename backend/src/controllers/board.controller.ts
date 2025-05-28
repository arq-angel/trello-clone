import {Response} from "express";
import {IBoard} from "../models/Board";
import {AuthRequest} from "../middleware/auth.middleware";
import {IBoardPlain, IUserPlain, toBoardPlain, toWorkspacePlain} from "../types";
import {CreateBoardInput} from "../validators/boards.validators";
import {
    createBoardService,
    deleteBoardWithCascadeService,
    getMyBoardsService,
    updateBoardService
} from "../services/board.service";
import {errorResponse, successResponse} from "../utils/helpers/response.format";
import {IWorkspace} from "../models/Workspace";
import {getWorkspaceByIdService} from "../services/workspace.service";
import {userHasWorkspaceAccess} from "../utils/helpers/access-controls";

export const createBoard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated: CreateBoardInput = req.validated;

        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({message: "User not found"}));
            return;
        }

        const workspace: IWorkspace | null = await getWorkspaceByIdService({id: validated.workspaceId});
        if (!workspace) {
            res.status(404).json(errorResponse({message: "Workspace not found"}));
            return;
        }

        const checkAccess = await userHasWorkspaceAccess({workspace, userId: user.id});
        if (!checkAccess) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this workspace"}));
            return;
        }

        const plainWorkspace = toWorkspacePlain(workspace);

        const board: IBoard = await createBoardService({
            input: validated,
            workspace: plainWorkspace,
            user,
        })

        const plainBoard: IBoardPlain = toBoardPlain(board);

        res.status(201).json(successResponse({
            message: "Board created successfully",
            data: plainBoard,
        }));
    } catch (error: any) {
        console.error("Error creating board: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to create board",
            error: error.stack,
        }));
    }
};

export const updateBoard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated = req.validated;

        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({message: "User not found"}));
            return;
        }

        const workspace: IWorkspace | null = await getWorkspaceByIdService({id: validated.workspaceId});
        if (!workspace) {
            res.status(404).json(errorResponse({message: "Workspace not found"}));
            return;
        }

        const checkAccess = await userHasWorkspaceAccess({workspace, userId: user.id});
        if (!checkAccess) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this workspace"}));
            return;
        }

        const board: IBoard | undefined = req.boardDoc;
        if (!board) {
            res.status(404).json({message: "Workspace not found"});
            return;
        }

        const updatedBoard = await updateBoardService({
            board,
            input: validated
        })

        const plainUpdatedBoard: IBoardPlain = toBoardPlain(updatedBoard);
        res.status(200).json(successResponse({
            message: "Board updated successfully",
            data: plainUpdatedBoard,
        }));
    } catch (error: any) {
        console.error("Error updating board: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to update board",
            error: error.stack,
        }));
    }
};

export const getMyBoards = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({message: "User not found"}));
            return;
        }

        const boards = await getMyBoardsService({userId: user.id,});

        const plainBoards: IBoardPlain[] = boards.map(toBoardPlain);

        res.status(200).json(successResponse({
            message: "Boards fetched successfully",
            data: plainBoards,
        }));
    } catch (error: any) {
        console.error("Error fetching boards: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to fetch boards",
            error: error.stack,
        }));
    }
};

export const getBoardById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const board: IBoard | undefined = req.boardDoc;
        if (!board) {
            res.status(404).json(errorResponse({message: "Board not found"}));
            return;
        }

        // Populate owner, members and workspace with specific user fields
        await board.populate([
            {path: 'owner', select: '_id name email'},
            {path: 'members', select: '_id name email'},
            {path: 'workspace', select: '_id name'}
        ]);

        const plainBoard: IBoardPlain = toBoardPlain(board);

        res.status(200).json(successResponse({
            message: "Board fetched successfully",
            data: plainBoard
        }));
    } catch (error: any) {
        console.error("Error fetching board: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to fetch board",
            error: error.stack,
        }));
    }
};

export const deleteBoard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const board: IBoard | undefined = req.boardDoc;
        if (!board) {
            res.status(404).json(errorResponse({message: "Board not found"}));
            return;
        }

        const plainBoard: IBoardPlain = toBoardPlain(board);
        await deleteBoardWithCascadeService({boardId: plainBoard.id});

        res.status(200).json(successResponse({
            message: "Board successfully deleted",
            data: null
        }));
    } catch (error: any) {
        console.error("Error deleting board: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to delete board",
            error: error.stack,
        }));
    }
}

