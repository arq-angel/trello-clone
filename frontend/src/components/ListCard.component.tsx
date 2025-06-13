import ListSettings from "@/components/list-card-components/ListSettings.component.tsx";
import type {IBoard, IList} from "@/models";
import {useTaskActions} from "@/hooks/useTaskActions.ts";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "@/app/store.ts";
import LoadingSpinner from "@/components/ui-components/LoadingSpinner.component.tsx";
import AddTaskModal from "@/components/modals/AddTask.modal.tsx";
import TaskItemModal from "./modals/TaskItem.modal";

interface ListCardProps {
    board: IBoard;
    list: IList;
}

const ListCard = ({board, list}: ListCardProps) => {
    const {fetchAllTasks} = useTaskActions();
    useEffect(() => {
        const fetchData = async () => {
            await fetchAllTasks(list.id);
        }
        fetchData();
    }, [list, fetchAllTasks]);

    const {tasksByList, fetching, fetchError} = useSelector((state: RootState) => state.tasks);



    return (
        <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-auto min-h-[400px] min-w-[250px]"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">{list.name}</div>
                <ListSettings list={list} board={board}/>
            </div>

            {/* Loading state */}
            {fetching && <LoadingSpinner message="Loading tasks..."/>}

            {/* Empty state */}
            {!fetching && !fetchError && tasksByList[list.id]?.length === 0 && (
                <div className="text-center mt-20 text-gray-500">
                    <p className="text-lg text-gray-500">No tasks yet.</p>
                </div>
            )}

            {/* tasks list */}
            {!fetching && !fetchError && tasksByList[list.id]?.length > 0 && (
                <div className="flex flex-col justify-start items-start gap-4 mb-3">
                    {tasksByList[list.id].map((task) => (
                        <TaskItemModal
                            key={task.id}
                            label={task.title}
                            task={task}
                            list={list}
                            className={`w-full bg-gray-100 text-black rounded px-4 py-2 border-b-5 
                                    ${(task.priority === "low") ? "border-blue-500" : ""}
                                    ${(task.priority === "medium") ? "border-yellow-500" : ""}
                                    ${(task.priority === "high") ? "border-red-500" : ""}
                            `}
                        />
                    ))}

                </div>
            )}

            <div className="mt-auto">
                <AddTaskModal list={list} isMenuModal={true} className="w-full bg-gray-100 rounded px-4 py-2"/>
            </div>

        </div>
    );
};

export default ListCard;