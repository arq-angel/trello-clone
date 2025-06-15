import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IList, ITask } from "@/models";
import TaskItemModal from "@/components/modals/TaskItem.modal.tsx";
import { useMemo } from "react";

interface Props {
    task: ITask;
    list: IList;
}

export const SortableTaskCard = ({ task, list }: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver,
    } = useSortable({
        id: task.id,
        data: {
            type: "task",
            task,
            list
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    const priorityBorderColor = useMemo(() => {
        switch (task.priority) {
            case "low":
                return "border-blue-500";
            case "medium":
                return "border-yellow-500";
            case "high":
                return "border-red-500";
            default:
                return "border-gray-300";
        }
    }, [task.priority]);

    const dragHandleProps = {
        ...listeners,
        ...attributes,
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative ${isOver ? "bg-gray-200" : ""}`}
        >
            <div
                {...dragHandleProps}
                className="absolute top-0 left-0 w-4 h-full cursor-grab active:cursor-grabbing z-10"
            />
            <TaskItemModal
                key={task.id}
                label={task.title}
                task={task}
                list={list}
                className={`w-full bg-white hover:bg-gray-50 text-black rounded px-4 py-2 border-l-4 ${priorityBorderColor} shadow-sm ${
                    isDragging ? "shadow-lg" : ""
                }`}
            />
        </div>
    );
};