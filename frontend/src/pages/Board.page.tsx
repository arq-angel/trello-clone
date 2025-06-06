import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {fetchListsByBoardId} from "../features/lists/list.thunks";
import type {RootState} from "../app/store";
import {useAppDispatch} from "../hooks";
import CreateListFormComponent from "../components/CreateListForm.component";
import CreateTaskFormComponent from "../components/CreateTaskForm.component";
import {fetchTasksByListId} from "../features/tasks/task.thunks";

const BoardPage = () => {
    const {boardId} = useParams<{ boardId: string }>();
    const dispatch = useAppDispatch();
    const {listsByBoard, loading: listsLoading, error: listsError} = useSelector((state: RootState) => state.lists);
    const {tasksByList, loading: tasksLoading, error: tasksError} = useSelector((state: RootState) => state.tasks);

    useEffect(() => {
        const fetchData = async () => {
            if (!boardId) return;

            try {
                const {lists} = await dispatch(fetchListsByBoardId({boardId})).unwrap();

                // Fetch tasks for each list
                for (const list of lists) {
                    await dispatch(fetchTasksByListId({listId: list.id}));
                }
            } catch (err) {
                console.error("Failed to load lists or tasks:", err);
            }
        };

        fetchData();
    }, [boardId, dispatch]);

    return (
        <div style={{padding: "1rem", display: "flex", gap: '1rem', overflowX: 'auto'}}>
            <h1 style={{width: "100%"}}>Board View</h1>

            {listsLoading && <p>Loading lists...</p>}
            {listsError && <p style={{color: "red"}}>Error: {listsError}</p>}

            {boardId && listsByBoard[boardId]?.map((list) => (
                    <div key={list.id}
                         style={{minWidth: "250px", border: "1 px solid #ccc", borderRadius: "6px", padding: "1rem"}}>
                        <h3>{list.name}</h3>

                        {tasksLoading && <p>Loading tasks...</p>}
                        {tasksError && <p style={{color: "red"}}>Error: {tasksError}</p>}
                        {tasksByList[list.id]?.map((task) => (
                            <div key={task.id} style={{marginBottom: 8}}>
                                <strong>{task.title}</strong>
                            </div>
                        ))}
                        <CreateTaskFormComponent listId={list.id}/>

                    </div>
                )
            )}

            <div style={{border: '1px dashed gray', padding: '1rem', width: 300}}>
                <h3>Add New List</h3>
                <CreateListFormComponent boardId={boardId!}/>
            </div>

        </div>
    );
};

export default BoardPage;