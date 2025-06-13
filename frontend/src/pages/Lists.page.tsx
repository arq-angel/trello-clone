import {useEffect} from "react";
import {useMatch} from "react-router-dom";
import {useSelector} from "react-redux";
import type {RootState} from "../app/store";
import BoardsNavbar from "../components/BoardsNavbar.component.tsx"
import {toast} from "react-hot-toast";
import {useListActions} from "@/hooks/useListActions.ts";
import LoadingSpinner from "@/components/ui-components/LoadingSpinner.component.tsx";
import AddListModal from "@/components/modals/AddList.modal.tsx";
import ListCard from "@/components/ListCard.component.tsx";

const Lists = () => {
    const match = useMatch("workspaces/:workspaceId/boards/:boardId/*");
    const workspaceId = match?.params.workspaceId  ?? '';
    const boardId = match?.params.boardId ?? '';

    const {fetchAllLists} = useListActions();
    useEffect(() => {
        const fetchData = async () => {
            if (!boardId) return;
            await fetchAllLists(boardId);
        }
        fetchData();
    }, [boardId, fetchAllLists]);

    const {listsByBoard, fetching, fetchError} = useSelector((state: RootState) => state.lists);

    const selectedWorkspace = useSelector((state: RootState) => state.selectedWorkspace);
    const selectedBoard = useSelector((state: RootState) => state.selectedBoard);

    /* if error occurs while fetching boards */
    useEffect(() => {
        if (fetchError) {
            toast.error(fetchError);
        }
    }, [fetchError]);

    return (
        <>
            <BoardsNavbar/>
            <div className="py-6 max-w-7xl mx-auto">
                {/* Loading state */}
                {fetching && <LoadingSpinner message="Loading boards..."/>}

                {/* Empty state */}
                {!fetching && !fetchError && listsByBoard[boardId]?.length === 0 && (
                    <div className="text-center mt-20 text-gray-500">
                        <p className="text-lg">You don’t have any lists in this board yet.</p>
                        <div className="mt-4">
                            <AddListModal board={selectedBoard}/>
                        </div>
                    </div>
                )}

                {/* Workspace cards */}
                {!fetching && !fetchError && listsByBoard[boardId]?.length > 0 && (
                    <div className="flex gap-4 overflow-x-auto items-start">
                        {listsByBoard[boardId].map((list) => (
                            <ListCard key={list.id} board={selectedBoard} list={list}/>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Lists;