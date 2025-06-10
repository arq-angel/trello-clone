import {Trash2, Clock, MessageCircleMore, Plus, Ellipsis, SquarePen} from "lucide-react";
import {useState, useEffect, useRef} from "react";
import {useAppDispatch} from "../hooks.ts";
import {useSelector} from "react-redux";
import {fetchCommentsByTaskId} from "../features/comments/comment.thunks.ts";
import type {RootState} from "../app/store.ts";
import type {IComment} from "../models";
import CommentItem from "./CommentItem.component.tsx";
import CreateCommentFormComponent from "./CreateCommentForm.component.tsx";

const TaskItemComponent = ({task, handleDeleteTask}) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const [commentsCount, setCommentsCount] = useState(0);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const taskId = task?.id;
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            console.log("Task Id: ", taskId);
            if (!taskId) return;

            try {
                await dispatch(fetchCommentsByTaskId({taskId})).unwrap();
            } catch (error) {
                console.log("Failed to fetch comments: ", error)
            }
        }

        fetchData();
    }, [taskId, dispatch]);

    return (
        <>
            <li
                key={task.id}
                className="bg-white rounded px-3 py-2 text-sm shadow relative overflow-visible hover: cursor-grab"
            >

                <div className="flex justify-between items-center mb-4">
                    <div className="inline-block w-auto h-auto cursor-default">
                        {task?.title}
                    </div>
                    <TaskSettings handleDeleteTask={handleDeleteTask} taskId={taskId}/>
                </div>

                <div className="mt-2 flex items-center space-x-1 text-xs text-gray-400 justify-start">
                    <div className="flex items-center gap-1 cursor-default">
                        <Clock className="w-3.5 h-3.5"/>
                        <span>{task?.dueDate || "No due date"}</span>
                    </div>

                    <div className="ms-3 flex items-center gap-1 hover:cursor-pointer" onClick={handleOpen}>
                        <MessageCircleMore className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{commentsCount}</span>
                    </div>


                </div>


                {/* Priority Indicator Bar */}
                <div
                    className={`absolute bottom-0 left-0 w-full h-1 rounded-b
                                              ${task?.priority === "low" ? "bg-blue-500" : ""}
                                              ${task?.priority === "medium" ? "bg-yellow-500" : ""}
                                              ${task?.priority === "high" ? "bg-red-500" : ""}
                                            `}
                />
            </li>

            <Modal isOpen={isModalOpen} onClose={handleClose}>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New Task</h2>
                <CommentsModal task={task} setModalOpen={setModalOpen} setCommentsCount={setCommentsCount} />
            </Modal>
        </>
    );
};

const TaskSettings = ({handleDeleteTask, taskId}: { handleDeleteTask: (taskId) => void, taskId: string }) => {
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
                    <ProfileMenuItem icon={SquarePen} label="Edit List"
                                     onClick={() => console.log("Edit List button clicked")}/>
                    <ProfileMenuItem icon={Trash2} label="Delete List" onClick={() => {
                        console.log("List id at the button", taskId)
                        handleDeleteTask(taskId)
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


const CommentsModal = ({setModalOpen, task, setCommentsCount}) => {
    const dispatch = useAppDispatch();
    const {commentsByTask, loading, error} = useSelector((state: RootState) => state.comments);

    const taskId = task?.id;

    useEffect(() => {
        if (taskId && commentsByTask[taskId]) {
            setCommentsCount(commentsByTask[taskId].length);
        } else {
            setCommentsCount(0);
        }
    }, [taskId, commentsByTask, setCommentsCount]);

    const [deleteCommentError, setDeleteCommentError] = useState(null);

    const handleDeleteComment = async (commentId: string) => {
        console.log("Comment Id to delete: ", commentId);
        if (!commentId) return;
    }

    return (
        <div className="fixed inset-0  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
                {loading && <p>Loading comments...</p>}
                {error && <p style={{color: "red"}}>Error: {error}</p>}

                <h2 className="text-xl font-bold mb-4">Comments</h2>
                {/* Add more task details here */}

                <ul className="flex flex-col gap-3 mb-4">
                    {task?.id && commentsByTask[task.id]?.map((comment: IComment) => (
                        <CommentItem key={comment.id} comment={comment} handleDeleteComment={handleDeleteComment}/>
                    ))}
                </ul>

                <AddCommentButton icon={Plus} label="Add Comment" className="rounded bg-gray-100/50" taskId={task?.id} />
            </div>
        </div>
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

const AddCommentButton = ({icon: Icon, label, className, taskId}) => {
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
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Add a comment</h2>
                <CreateCommentFormComponent taskId={taskId} setModalOpen={setModalOpen}/>
            </Modal>
        </>
    )
}

export default TaskItemComponent;