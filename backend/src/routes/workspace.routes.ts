import express from "express";
import {
    createWorkspace,
    updateWorkspace,
    getMyWorkspaces,
    deleteWorkspace,
    getWorkspaceById
} from "../controllers/workspace.controller";
import {protect} from "../middleware/auth.middleware";
import {validate} from "../middleware/validate.middleware";
import {CreateWorkspaceSchema, UpdateWorkspaceSchema} from "../validators/workspace.validators";
import {modelBinder} from "../middleware/routeModelBinder.middleware";
import {toWorkspacePlain} from "../types";
import Workspace from "../models/Workspace";
import {authorizeWorkspaceOwner} from "../middleware/authorizeWorkspaceOwner.middleware";
import {authorizeWorkspaceMember} from "../middleware/authorizeWorkspaceMember.middleware";

const router = express.Router();

router.route("/")
    .post(protect, validate(CreateWorkspaceSchema), createWorkspace)
    .get(protect, getMyWorkspaces);

router.route("/:id")
    .get(
        protect,
        modelBinder({
            param: "id",
            model: Workspace,
            key: "workspaceDoc",
            plainKey: "workspace",
            toPlain: toWorkspacePlain
        }),
        authorizeWorkspaceMember,
        getWorkspaceById
    )
    .put(
        protect,
        modelBinder({
            param: "id",
            model: Workspace,
            key: "workspaceDoc",
            plainKey: "workspace",
            toPlain: toWorkspacePlain
        }),
        authorizeWorkspaceOwner,
        validate(UpdateWorkspaceSchema),
        updateWorkspace
    )
    .delete(
        protect,
        modelBinder({
            param: "id",
            model: Workspace,
            key: "workspaceDoc",
            plainKey: "workspace",
            toPlain: toWorkspacePlain
        }),
        authorizeWorkspaceOwner,
        deleteWorkspace
    );

export default router;