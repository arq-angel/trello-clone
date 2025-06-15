import {useEffect, useRef, useState} from "react";
import type {IComment, IList, ITask} from "@/models";
import TaskItemSettings from "@/components/task-components/TaskItemSettings.component.tsx";
import {useCommentActions} from "@/hooks/useCommentActions.ts";
import {useSelector} from "react-redux";
import type {RootState} from "@/app/store.ts";
import {Clock, MessageCircleMore} from "lucide-react";
import AddCommentModal from "@/components/modals/AddComment.modal.tsx";
import CommentItem from "@/components/ui-components/CommentItem.ui.tsx";
import LoadingSpinner from "@/components/ui-components/LoadingSpinner.component.tsx";

interface TaskItemModalProps {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    label?: string;
    task: ITask;
    list: IList;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    dragListeners?: React.HTMLAttributes<HTMLElement>; // or more specific
}

const TaskItemModal = ({
                           icon: Icon,
                           label,
                           task,
                           list,
                           onClick,
                           className,
                           disabled,
                           dragListeners
                       }: TaskItemModalProps) => {
    const [commentsCount, setCommentsCount] = useState(0);

    const {fetchAllComments} = useCommentActions();
    useEffect(() => {
        const fetchData = async () => {
            if (!task) return;
            await fetchAllComments(task.id);
        }
        fetchData();
    }, [task, fetchAllComments]);

    const {commentsByTask, fetching, fetchError} = useSelector((state: RootState) => state.comments);

    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setShowModal(false);
            }
        }

        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showModal]);

    useEffect(() => {
        if (!task) return;
        if (task.id && commentsByTask[task.id]) {
            setCommentsCount(commentsByTask[task.id].length);
        } else {
            setCommentsCount(0);
        }
    }, [task, commentsByTask, setCommentsCount]);

    return (
        <div className="flex gap-1 items-center">
            <span
                {...dragListeners}
                className="cursor-grab"
                title="Drag to move task"
            >
                     ⠿
            </span>
            <button
                onClick={() => {
                    if (disabled) return;
                    if (onClick) {
                        onClick();
                    } else {
                        setShowModal((prev) => !prev);
                    }
                }}
                disabled={disabled}
                className={` px-3 py-1 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-200 ${className ?? ""}`}
            >
                <div className="flex flex-col gap-1">
                    <div className="inline-flex items-center">
                        {Icon && !label && <Icon className="h-5 w-5"/>}
                        {Icon && label && <Icon className="h-5 w-5 mr-2"/>}
                        {label ?? ''}
                    </div>
                    <div className="mt-2 flex items-center space-x-1 text-xs justify-start">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5"/>
                            <span>{task?.dueDate || "No due date"}</span>
                        </div>

                        <div className="ms-2 flex items-center gap-1">
                            <MessageCircleMore className="h-4 w-4"/>
                            <span className="text-sm">{commentsCount}</span>
                        </div>
                    </div>
                </div>

            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold mb-4">{task.title}</h2>
                            <TaskItemSettings task={task} list={list}/>
                        </div>

                        <div className="mt-auto flex flex-col gap-3">
                            <p>Comments:</p>

                            <AddCommentModal task={task} isMenuModal={true}
                                             className="w-full bg-gray-100 rounded px-4 py-2"/>

                            {/* Loading state */}
                            {fetching && <LoadingSpinner message="Loading comments..."/>}

                            {/* Empty state */}
                            {!fetching && !fetchError && commentsByTask[task.id]?.length === 0 && (
                                <div className="text-center mt-20 text-gray-500">
                                    <p className="text-lg">No comments yet.</p>
                                </div>
                            )}

                            <div className="flex flex-col justify-start items-start gap-2 mb-3">
                                {commentsByTask[task.id].map((comment: IComment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        className="w-full rounded"
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};


export default TaskItemModal;