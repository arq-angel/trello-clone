import ListSettings from "@/components/list-card-components/ListSettings.component.tsx";
import type {IBoard, IList, ITask} from "@/models";
import {useTaskActions} from "@/hooks/useTaskActions.ts";
import LoadingSpinner from "@/components/ui-components/LoadingSpinner.component.tsx";
import AddTaskModal from "@/components/modals/AddTask.modal.tsx";
import {SortableTaskCard} from "@/components/SortableTaskCard.component.tsx";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {useState} from "react";

interface ListCardProps {
    board: IBoard;
    list: IList;
    tasks: ITask[];
    tasksFetching: boolean;
    dragListeners?: any;
}

const ListCard = ({board, list, tasks, tasksFetching, dragListeners}: ListCardProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    return (
        <div
            className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow flex flex-col h-auto min-h-[400px] min-w-[250px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex justify-start items-center gap-3">
                    <div className="text-lg font-semibold">{list.name}</div>
                    <span
                        {...dragListeners}
                        className="cursor-grab"
                        title="Drag to move list"
                    >
                        ⠿
                    </span>
                </div>
                <ListSettings list={list} board={board}/>
            </div>

            {/* Loading state */}
            {tasksFetching && <LoadingSpinner message="Loading tasks..."/>}

            {/* Empty state */}
            {!tasksFetching && tasks.length === 0 && (
                <div className="text-center mt-20 text-gray-500">
                    <p className="text-lg text-gray-500">No tasks yet.</p>
                </div>
            )}

            {/* Tasks list */}
            {!tasksFetching && tasks.length > 0 && (
                <SortableContext
                    items={tasks.map(task => task.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col justify-start items-start gap-4 mb-3">
                        {tasks.map((task: ITask) => (
                            <SortableTaskCard key={task.id} task={task} list={list}/>
                        ))}
                    </div>
                </SortableContext>

            )}

            <div className="mt-auto">
                <AddTaskModal list={list} isMenuModal={true} className="w-full bg-gray-100 rounded px-4 py-2"/>
            </div>
        </div>
    );
};

export default ListCard;