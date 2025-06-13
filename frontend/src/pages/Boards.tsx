import BoardsNavbar from "../components/BoardsNavbar.component.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/app/store.ts";
import {useEffect} from "react";
import {toast} from "react-hot-toast";
import {useMatch} from "react-router-dom";
import LoadingSpinner from "@/components/ui-components/LoadingSpinner.component.tsx";
import CreateBoardModal from "@/components/modals/CreateBoard.modal.tsx";
import BoardCard from "@/components/BoardCard.component.tsx";

const Boards = () => {
    const match = useMatch("/workspaces/:workspaceId/*");
    const workspaceId = match?.params.workspaceId ?? "";

    const {boardsByWorkspace, fetching, fetchError} = useSelector((state: RootState) => state.boards);

    const selectedWorkspace = useSelector((state: RootState) => state.selectedWorkspace);

    /* if error occurs while fetching boards */
    useEffect(() => {
        if (fetchError) {
            toast.error(fetchError);
        }
    }, [fetchError]);

    return (
        <>
            <BoardsNavbar/>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Your Boards</h1>
                    <CreateBoardModal workspace={selectedWorkspace} />
                </div>

                {/* Loading state */}
                {fetching && <LoadingSpinner message="Loading boards..."/>}

                {/* Empty state */}
                {!fetching && !fetchError && boardsByWorkspace[workspaceId]?.length === 0 && (
                    <div className="text-center mt-20 text-gray-500">
                        <p className="text-lg">You don’t have any boards in this workspace yet.</p>
                        <div className="mt-4">
                            <CreateBoardModal workspace={selectedWorkspace} />
                        </div>
                    </div>
                )}

                {/* Workspace cards */}
                {!fetching && !fetchError && boardsByWorkspace[workspaceId]?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {boardsByWorkspace[workspaceId].map((board) => (
                            <BoardCard key={board.id} board={board} workspace={selectedWorkspace}/>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};


export default Boards;