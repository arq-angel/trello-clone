import {useAppDispatch} from "../hooks.ts";
import {useNavigate, useMatch} from "react-router-dom";
import {useSelector} from "react-redux";
import type {RootState} from "../app/store.ts";
import {useEffect} from "react";
import {setSelectedWorkspace} from "../features/workspaces/selectedWorkspace.slice.ts";
import {setSelectedBoard} from "../features/boards/selectedBoard.slice.ts";
import {Layers, Calendar, Star, Menu, Earth} from "lucide-react";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import PipeIcon from "@/components/ui-components/PipeIcon.ui.tsx";
import BoardsDropdown from "@/components/board-navbar-components/BoardsDropdown.component.tsx";
import BoardSettings from "@/components/board-navbar-components/BoardSettings.component.tsx";
import {useBoardActions} from "@/hooks/useBoardsActions.ts";

const BoardsNavbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Match routes to extract workspaceId and boardId
    const boardMatch = useMatch("/workspaces/:workspaceId/boards/:boardId/*");
    const workspaceMatch = useMatch("/workspaces/:workspaceId/*");

    const workspaceId = boardMatch?.params.workspaceId ?? workspaceMatch?.params.workspaceId ?? "";
    const boardId = boardMatch?.params.boardId ?? "";

    const {fetchAllBoards} = useBoardActions();
    useEffect(() => {
        const fetchData = async () => {
            if (!workspaceId) return;
            await fetchAllBoards(workspaceId);
        }
        fetchData();
    }, [workspaceId, fetchAllBoards]);

    const {workspaces} = useSelector((state: RootState) => state.workspaces);
    const {boardsByWorkspace} = useSelector((state: RootState) => state.boards);

    const selectedWorkspace = useSelector((state: RootState) => state.selectedWorkspace)
    const selectedBoard = useSelector((state: RootState) => state.selectedBoard);

    useEffect(() => {
        if (!boardId) {
            dispatch(setSelectedBoard(null));
        }
        if (!workspaceId) {
            dispatch(setSelectedWorkspace(null));
        }
    }, [workspaceId, boardId, dispatch]);

    useEffect(() => {
        if (!workspaceId) return;

        if (!selectedBoard && boardId && boardsByWorkspace[workspaceId]?.length > 0) {
            const board = boardsByWorkspace[workspaceId].find((board) => board.id === boardId);
            if (board) {
                dispatch(setSelectedBoard(board));
            }
            const workspace = workspaces.find((workspace) => workspace.id === workspaceId);
            if (workspace) {
                dispatch(setSelectedWorkspace(workspace));
            }
        }
    }, [boardId, workspaceId, workspaces, boardsByWorkspace, selectedBoard, dispatch]);

    const handleSelectBoard = (boardId: string) => {
        if (!boardId) return;

        const board = boardsByWorkspace[workspaceId].find(board => board.id === boardId);

        if (board) {
            dispatch(setSelectedBoard(board));
            navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists`);
        }
    };

    return (
        <nav className="p-2 border-b border-gray-300 flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-1 flex-1">
                {/* Workspace dropdown */}
                <div className="relative">
                    <BoardsDropdown
                        workspace={selectedWorkspace}
                        boards={boardsByWorkspace[selectedWorkspace?.id]}
                        selectedBoard={selectedBoard}
                        handleSelectBoard={handleSelectBoard}
                    />
                </div>

                <PipeIcon/>
                {selectedBoard?.name && (
                    <>
                        <MenuItem
                            label={selectedBoard?.name}
                            onClick={() => console.log("Board Name clicked")}
                            className="rounded"
                        />
                        <MenuItem
                            icon={Star}
                            onClick={() => console.log("Starred button clicked")}
                            className="rounded"
                        />
                        <PipeIcon/>
                    </>
                )}
                <MenuItem
                    icon={Menu}
                    onClick={() => console.log("Menu clicked")}
                    className="rounded"
                />
                <MenuItem
                    icon={Earth}
                    label="Public"
                    onClick={() => console.log("Public button clicked")}
                    className="rounded"
                />
                <PipeIcon/>
                <MenuItem
                    label="Invite"
                    onClick={() => console.log("Invite button clicked")}
                    className="rounded"
                />
            </div>

            {/* Right section */}
            <div className="flex items-center gap-1 flex-1 justify-end">
                <MenuItem
                    icon={Calendar}
                    label="Calendar"
                    onClick={() => console.log("Calendar clicked")}
                    className="rounded"
                />
                <MenuItem
                    icon={Layers}
                    label="Copy Board"
                    onClick={() => console.log("Copy Board clicked")}
                    className="rounded"
                />
                {selectedBoard && (
                    <BoardSettings
                        board={selectedBoard}
                        workspace={selectedWorkspace}
                    />
                )}
            </div>
        </nav>
    )
}

export default BoardsNavbar;
