import {Link, useParams} from "react-router-dom";
import {useAppDispatch} from "../hooks";
import {useSelector} from "react-redux";
import type {RootState} from "../app/store";
import {useEffect} from "react";
import {fetchBoardsByWorkspaceId} from "../features/boards/board.thunks";
import CreateBoardForm from "../components/CreateBoardForm.component";
import type {IBoard} from "../models";

const WorkspacePage = () => {
    const {workspaceId} = useParams<{ workspaceId: string }>();
    const dispatch = useAppDispatch();
    const {boardsByWorkspace, loading, error} = useSelector((state: RootState) => state.boards);

    useEffect(() => {
        const fetchData = async () => {
            if (!workspaceId) return;

            try {
                await dispatch(fetchBoardsByWorkspaceId({workspaceId})).unwrap();
            } catch (err) {
                console.error("Failed to load boards:", err);
            }
        }

        fetchData();
    }, [workspaceId, dispatch]);

    return (
        <div>
            <h1>WorkspacePage Component</h1>
            <h1>Your Boards</h1>

            {loading && <p>Loading boards...</p>}
            {error && <p style={{color: "red"}}>Error: {error}</p>}

            {!loading && !error && <p>No boards found. Create one to get started!</p>}

            <ul>
                {workspaceId && boardsByWorkspace[workspaceId]?.map((board: IBoard) => (
                    <Link key={board.id} to={`/boards/${board.id}`}>
                        <div>{board.name}</div>
                    </Link>
                ))}
            </ul>

            <div style={{border: '1px dashed gray', padding: '1rem', width: 300}}>
                <h3>Add New List</h3>
                <CreateBoardForm workspaceId={workspaceId!}/>
            </div>

        </div>
    );
};

export default WorkspacePage;