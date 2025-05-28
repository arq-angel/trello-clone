import Workspace, {IWorkspace} from "../models/Workspace";
import {CreateWorkspaceInput, UpdateWorkspaceInput} from "../validators/workspace.validators";
import {IUserPlain} from "../types";

export const createWorkspaceService = async ({input, user}: {
    input: CreateWorkspaceInput,
    user: IUserPlain
}): Promise<IWorkspace> => {
    const workspace: IWorkspace = await Workspace.create({
        name: input.name,
        owner: user.id, // using the user id from user obtained from auth middleware
        members: [user.id] // using the user id from user obtained from auth middleware
    });

    // Populate owner and members with specific user fields
    await workspace.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'}
    ]);

    return workspace;
};

export const updateWorkspaceService = async ({workspace, input}: {
    workspace: IWorkspace,
    input: UpdateWorkspaceInput,
}): Promise<IWorkspace> => {
    // Apply updates from req.body, but make sure to sanitize to prevent unwanted field updates
    Object.assign(workspace, input);

    const savedWorkspace: IWorkspace = await workspace.save();

    // Populate owner and members with specific user fields
    await savedWorkspace.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'}
    ]);

    return savedWorkspace;
};

export const getWorkspaceByIdService = async ({id}: { id: string }): Promise<IWorkspace | null> => {
    const workspace: IWorkspace | null = await Workspace.findById(id);
    if (!workspace) {
        return null;
    }

    // Populate owner and members with specific user fields
    await workspace.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'}
    ]);

    return workspace;
};

export const getMyWorkspacesService = async ({userId}: { userId: string }): Promise<IWorkspace[]> => {
    const workspaces: IWorkspace[] = await Workspace.find({members: userId})
        .populate([
            {path: "owner", select: "_id name email"},
            {path: "members", select: "_id name email"}
        ]);

    return workspaces;
};

// deleteWorkspace doesn't really need a service function because it only has one line of code after receiving
// workspace object from routeModelBinder middleware