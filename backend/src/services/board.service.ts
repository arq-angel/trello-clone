import {CreateBoardInput, UpdateBoardInput} from "../validators/boards.validators";
import {IUserPlain, IWorkspacePlain} from "../types";
import Board, {IBoard} from "../models/Board";

export const createBoardService = async ({input, workspace, user}: {
    input: CreateBoardInput,
    workspace: IWorkspacePlain,
    user: IUserPlain
}): Promise<IBoard> => {
    const board: IBoard = new Board({
        name: input.name,
        owner: user.id, // using the user id from user obtained from auth middleware
        members: [user.id], // using the user id from user obtained from auth middleware
        workspaceId: workspace.id // using the workspace id from board obtained from isWorkspaceMember middleware
    });

    await board.save();

    // Populate owner and members with specific user fields
    await board.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'},
        {path: 'workspaceId', select: '_id name'}
    ]);

    return board;
};

export const updateBoardService = async ({board, input}: {
    board: IBoard,
    input: UpdateBoardInput,
}) => {
    // Apply updates from req.body, but make sure to sanitize to prevent unwanted field updates
    Object.assign(board, input);

    const savedBoard: IBoard = await board.save();

    // Populate owner and members with specific user fields
    await savedBoard.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'},
        {path: 'workspaceId', select: '_id name'}
    ])

    return savedBoard;
};

export const getBoardByIdService = async ({id}: { id: string }): Promise<IBoard | null> => {
    const board: IBoard | null = await Board.findById(id);
    if (!board) {
        return null;
    }

    // Populate owner and members with specific user fields
    await board.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'}
    ]);

    return board;
};

export const getMyBoardsService = async ({userId}: { userId: string }): Promise<IBoard[]> => {

    const boards: IBoard[] = await Board.find({members: userId})
        .populate([
            {path: 'owner', select: '_id name email'},
            {path: 'members', select: '_id name email'},
            {path: 'workspaceId', select: '_id name'}
        ]);

    return boards;
};