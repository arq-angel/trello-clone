import {Ellipsis, Plus, SquarePen, Trash, Trash2} from "lucide-react";
import {useAppDispatch} from "../hooks.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../app/store.ts";
import {useState, useEffect, useRef} from "react";
import {deleteTask, fetchTasksByListId} from "../features/tasks/task.thunks.ts";
import type {ITask} from "../models";
import CreateTaskFormComponent from "./CreateTaskForm.component.tsx";
import TaskItemComponent from "./TaskItem.component.tsx";
import {deleteBoard} from "../features/boards/board.thunks.ts";
import {toast} from "react-hot-toast";
import {handleApiError} from "../utils/handleApiError.ts";

const ListItem = ({list, handleDeleteList}) => {
    const listId = list?.id;
    const dispatch = useAppDispatch();
    const {tasksByList, loading, error} = useSelector((state: RootState) => state.tasks);

    const [deleteTaskError, setDeleteTaskError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("List Id: ", listId);
            if (!listId) return;

            try {
                await dispatch(fetchTasksByListId({listId})).unwrap();
            } catch (error) {
                console.log("Failed to load tasks: ", error);
            }
        }

        fetchData();
    }, [listId, dispatch])

    const handleDeleteTask = async (taskId: string) => {
        console.log("Task Id to delete: ", taskId);
        if (!taskId) return;

        const resultAction = await dispatch(deleteTask({taskId}));

        if (deleteTask.fulfilled.match(resultAction)) {
            toast.success("Task deleted successfully!");
        } else {
            // console.error("Registration Error:", resultAction.payload);
            // If you want to set form errors from the API validation error,
            // you can call your handleApiError function here, passing the error payload.
            handleApiError(resultAction.payload, setDeleteTaskError);
        }

    }

    return (
        <li key={list.id} className="relative h-screen">
            <div
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-auto min-h-[300px] min-w-[250px]"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold">{list.name}</div>
                    <ListSettings handleDeleteList={handleDeleteList} listId={listId}/>
                </div>

                {/* Error & Loading States */}
                {loading && <p className="text-sm text-gray-500">Loading tasks...</p>}
                {error && <p className="text-sm text-red-500">Error: {error}</p>}
                {deleteTaskError && <p className="text-sm text-red-500">Delete task Error: {deleteTaskError}</p>}

                {!loading && !error && tasksByList[listId]?.length === 0 && (
                    <p className="text-sm text-gray-400 mb-2">No tasks found. Add one to get started!</p>
                )}

                {/* Task List */}
                <ul className="flex flex-col gap-3 mb-4">
                    {listId && tasksByList[listId]?.map((task: ITask) => (
                            <TaskItemComponent key={task.id} task={task} handleDeleteTask={handleDeleteTask}/>
                        ))}
                </ul>

                <AddTaskButton icon={Plus} label="Add Task" className="rounded bg-gray-100/50" listId={listId}/>

                {/* Footer */}
                <div className="mt-2 text-xs text-gray-400">Last updated: 2 days ago</div>
            </div>


            {/*<button
                type="button"
                className="absolute bottom-4 right-4 p-1 text-red-600 hover:text-red-800 transition-colors rounded bg-white"
                onClick={(e) => {
                    e.stopPropagation();  // just in case
                    handleDeleteList(list.id);
                }}
                aria-label="Delete list"
            >
                <Trash2 size={18} className="hover: cursor-pointer"/>
            </button>*/}
        </li>
    );
};

const ListSettings = ({handleDeleteList, listId}: { handleDeleteList: ({listId}) => void, listId: string }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className={`rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200
            flex items-center text-sm text-gray-700 text-left`}
            >
                <BoardNavbarItem icon={Ellipsis}/>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <AddTaskButton icon={Plus} label="Add Task" className="" listId={listId}/>
                    <ProfileMenuItem icon={SquarePen} label="Edit List"
                                     onClick={() => console.log("Edit List button clicked")}/>
                    <ProfileMenuItem icon={Trash2} label="Delete List" onClick={() => {
                        console.log("List id at the button", listId)
                        handleDeleteList(listId)
                    }}
                                     className="text-red-600 hover:bg-red-100"/>
                </div>
            )}
        </div>
    )
}

interface BoardNavbarItemProps {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    label?: string;
    onClick?: () => void;
    className?: string;
}

const BoardNavbarItem = ({icon: Icon, label, onClick, className}: BoardNavbarItemProps) => {
    return (
        <div
            onClick={onClick}
            className={`px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200
            flex items-center text-sm text-gray-700 text-left ${className ?? ""}`}
        >
            {Icon && !label && <Icon className="w-5 h-5"/>}
            {Icon && label && <Icon className="w-4 h-4 mr-2"/>}
            {label ?? ''}
        </div>
    )
}

interface ProfileMenuItemProps {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    onClick?: () => void;
    className?: string;
}

const ProfileMenuItem = ({icon: Icon, label, onClick, className}: ProfileMenuItemProps) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-2 text-sm text-gray-700 hover: cursor-pointer hover:bg-gray-100 w-full text-left ${className ?? ""}`}
    >
        <Icon className="w-4 h-4 mr-2"/>
        {label}
    </button>
);

const AddTaskButton = ({icon: Icon, label, className, listId}) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    return (<>
            <button
                onClick={handleOpen}
                className={`flex items-center px-4 py-2 text-sm text-gray-700 hover: cursor-pointer hover:bg-gray-100 w-full text-left ${className ?? ""}`}
            >
                <Icon className="w-4 h-4 mr-2"/>
                {label}
            </button>

            <Modal isOpen={isModalOpen} onClose={handleClose}>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New Task</h2>
                <CreateTaskFormComponent listId={listId} setModalOpen={setModalOpen}/>
            </Modal>
        </>
    )
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({isOpen, onClose, children}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default ListItem;