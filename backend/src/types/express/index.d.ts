import {IUserPlain, IUserShort} from "../user.plain"; // relative path from `express/index.d.ts` to `user.ts`
import {IWorkspacePlain, IWorkspaceShort} from "../workspace.plain";
import {IBoardPlain, IBoardShort} from "../board.plain";
import {IListPlain} from "../list.plain";
import {ITaskPlain} from "../task.plain";
import {ICommentPlain} from "../comment.plain";

declare global {
    namespace Express {
        interface Request {
            validated?: any,

            user?: IUserPlain;
            workspace?: IWorkspacePlain;
            board?: IBoardPlain;
            list?: IListPlain;
            task?: ITaskPlain;
            comment?: ICommentPlain;

            userShort?: IUserShort;
            workspaceShort?: IWorkspaceShort;
            boardShort?: IBoardShort;
            listShort?: IListShort;
            taskShort?: ITaskShort;
        }
    }
}
