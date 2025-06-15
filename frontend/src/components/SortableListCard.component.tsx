import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ListCard from "@/components/ListCard.component.tsx";
import type { IBoard, IList, ITask } from "@/models";
import {memo} from "react";

interface Props {
    list: IList;
    board: IBoard;
    tasks: ITask[];
    tasksFetching: boolean;
    isDragging?: boolean;
}

export const SortableListCard = memo(({ list, board, tasks, tasksFetching }: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: list.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: 1
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <ListCard
                list={list}
                board={board}
                tasks={tasks}
                tasksFetching={tasksFetching}
                dragListeners={listeners}
            />
        </div>
    );
});