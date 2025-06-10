import {useEffect, useState} from "react";
import {useMatch} from "react-router-dom";
import {useSelector} from "react-redux";
import {deleteList, fetchListsByBoardId} from "../features/lists/list.thunks";
import type {RootState} from "../app/store";
import {useAppDispatch} from "../hooks";
import BoardsNavbar from "../components/BoardsNavbar.component.tsx"
import ListItem from "../components/ListItem.component.tsx";
import type {IList} from "../models";
import {toast} from "react-hot-toast";
import {handleApiError} from "../utils/handleApiError.ts";

const BoardListsPage = () => {
    const match = useMatch("workspaces/:workspaceId/boards/:boardId/*");
    const workspaceId = match?.params.workspaceId;
    const boardId = match?.params.boardId;

    const dispatch = useAppDispatch();
    const {listsByBoard, loading, error} = useSelector((state: RootState) => state.lists);

    const [deleteListError, setDeleteListError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Board Id: ", boardId);
            if (!boardId) return;

            try {
                await dispatch(fetchListsByBoardId({boardId})).unwrap();
            } catch (error) {
                // handleApiError(error);
                console.error("Failed to load lists:", error);
            }
        }

        fetchData();
    }, [boardId, dispatch]);

    const handleDeleteList = async (listId: string) => {
        console.log("List Id to delete: ", listId);
        if (!listId) return;

        const resultAction = await dispatch(deleteList({listId}));

        if (deleteList.fulfilled.match(resultAction)) {
            toast.success("List deleted successfully!");
        } else {
            // console.error("Registration Error:", resultAction.payload);
            // If you want to set form errors from the API validation error,
            // you can call your handleApiError function here, passing the error payload.
            handleApiError(resultAction.payload, setDeleteListError);
        }

    }

    return (
        <div>

            <BoardsNavbar workspaceId={workspaceId} boardId={boardId}/>

            {loading && <p>Loading lists...</p>}
            {!boardId && <p>No board Id...</p>}
            {error && <p style={{color: "red"}}>Error: {error}</p>}
            {deleteListError && <p style={{color: "red"}}>Delete list Error: {deleteListError}</p>}

            {!loading && !error && listsByBoard[boardId]?.length === 0 &&
                <p>No lists found. Create one to get started!</p>}

            <div className="overflow-x-auto pb-4">
                <ul className="flex gap-4 min-w-max px-2 pt-3 pb-3">
                    {boardId && listsByBoard[boardId]?.map((list: IList) => (

                        <ListItem key={list.id} list={list} handleDeleteList={handleDeleteList} />

                        /*<li key={list.id}>
                            <div className="bg-gray-100 rounded-lg shadow-md p-4 w-64 min-h-[300px] flex flex-col">
                                <h3 className="text-md font-bold text-gray-800 mb-3">{list.name}</h3>


                                {/!* Tasks *!/}

                                {/!* Comments *!/}

                            </div>
                        </li>*/
                    ))}
                </ul>
            </div>

            {/*It is being handled in BoardsNavbar component*/}
            {/* Add New List Card */}

        </div>
    );
};

export default BoardListsPage;