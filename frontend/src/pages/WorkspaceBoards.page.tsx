import {useMatch} from "react-router-dom";
import BoardsNavbar from "../components/BoardsNavbar.component.tsx";

const WorkspaceBoardsPage = () => {
    const match = useMatch("/workspaces/:workspaceId/*");
    const workspaceId = match?.params.workspaceId;

    return (
        <div>
            <BoardsNavbar workspaceId={workspaceId} />
        </div>
    );
};


export default WorkspaceBoardsPage;