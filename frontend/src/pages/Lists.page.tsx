import {useEffect, useMemo, useRef, useState} from "react";
import {useMatch} from "react-router-dom";
import {useSelector} from "react-redux";
import type {RootState} from "../app/store";
import BoardsNavbar from "../components/BoardsNavbar.component.tsx";
import {toast} from "react-hot-toast";
import {useListActions} from "@/hooks/useListActions.ts";
import LoadingSpinner from "@/components/ui-components/LoadingSpinner.component.tsx";
import AddListModal from "@/components/modals/AddList.modal.tsx";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    horizontalListSortingStrategy,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {SortableListCard} from "@/components/SortableListCard.component.tsx";
import {useTaskActions} from "@/hooks/useTaskActions.ts";
import type {IList, ITask} from "@/models";

const Lists = () => {
    const match = useMatch("workspaces/:workspaceId/boards/:boardId/*");
    const boardId = match?.params.boardId ?? "";

    const {fetchAllLists, moveList} = useListActions();
    const {listsByBoard, fetching, fetchError} = useSelector((state: RootState) => state.lists);
    const selectedBoard = useSelector((state: RootState) => state.selectedBoard);
    const {
        tasksByList,
        fetching: tasksFetching,
        fetchError: tasksFetchError
    } = useSelector((state: RootState) => state.tasks);
    const {fetchAllTasks, moveTask} = useTaskActions();

    const [activeList, setActiveList] = useState<IList | null>(null);
    const [activeTask, setActiveTask] = useState<ITask | null>(null);
    const [isLocalReordering, setIsLocalReordering] = useState(false);
    const [optimisticTasks, setOptimisticTasks] = useState<Record<string, ITask[]>>({});

    const listsFromRedux = useMemo(() => listsByBoard[boardId] ?? [], [listsByBoard, boardId]);
    const lastSyncedRef = useRef<IList[]>(listsFromRedux);
    const [orderedLists, setOrderedLists] = useState(listsFromRedux);

    // Determine which tasks to display
    const displayTasks = useMemo(() => {
        return isLocalReordering ? optimisticTasks : tasksByList;
    }, [isLocalReordering, optimisticTasks, tasksByList]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Sync local state with Redux
    useEffect(() => {
        if (fetchError) toast.error(fetchError);
        if (tasksFetchError) toast.error(tasksFetchError);
    }, [fetchError, tasksFetchError]);

    useEffect(() => {
        if (boardId) {
            fetchAllLists(boardId);
        }
    }, [boardId, fetchAllLists]);

    useEffect(() => {
        if (isLocalReordering) return;

        const reduxIds = listsFromRedux.map((l) => l.id).join(",");
        const localIds = lastSyncedRef.current.map((l) => l.id).join(",");

        if (reduxIds !== localIds) {
            setOrderedLists(listsFromRedux);
            lastSyncedRef.current = listsFromRedux;
        }
    }, [listsFromRedux, isLocalReordering]);

    useEffect(() => {
        const lists = listsByBoard[boardId] ?? [];
        if (lists.length > 0) {
            lists.forEach((list) => {
                fetchAllTasks(list.id);
            });
        }
    }, [listsByBoard, boardId, fetchAllTasks]);

    async function handleListDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        setActiveList(null);

        if (!active || !over || active.id === over.id) return;

        const oldIndex = orderedLists.findIndex((list) => list.id === active.id);
        const newIndex = orderedLists.findIndex((list) => list.id === over.id);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const newOrder = arrayMove(orderedLists, oldIndex, newIndex).map((list, idx) => ({
            ...list,
            position: idx + 1,
        }));

        setOrderedLists(newOrder);
        lastSyncedRef.current = newOrder;
        setIsLocalReordering(true);

        try {
            await Promise.all(newOrder.map((list) => moveList(list.id, list.position)));
            await fetchAllLists(boardId);
            setIsLocalReordering(false);
        } catch (error) {
            console.error("Failed to update list positions:", error);
            toast.error("Failed to save list order. Please try again.");
            setOrderedLists(listsFromRedux);
            lastSyncedRef.current = listsFromRedux;
            setIsLocalReordering(false);
        }
    }

    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;
        if (!active) return;

        // Check if it's a list
        const list = orderedLists.find((l) => l.id === active.id);
        if (list) {
            setActiveList(list);
            return;
        }

        // Check if it's a task
        for (const listId in displayTasks) {
            const task = displayTasks[listId].find((t) => t.id === active.id);
            if (task) {
                setActiveTask(task);
                return;
            }
        }
    };

    const handleTaskDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;
        setActiveTask(null);

        if (!active || !over || active.id === over.id) return;

        // 1. Identify the source list and task
        let sourceListId = "";
        let task: ITask | null = null;
        let taskIndex = -1;

        for (const listId in tasksByList) {
            const foundIndex = tasksByList[listId].findIndex((t) => t.id === active.id);
            if (foundIndex !== -1) {
                sourceListId = listId;
                task = tasksByList[listId][foundIndex];
                taskIndex = foundIndex;
                break;
            }
        }

        if (!task || !sourceListId) return;

        // 2. Determine destination list and index
        let destinationListId = sourceListId;
        let newIndex = -1;

        // If over is a task
        for (const listId in tasksByList) {
            const overIndex = tasksByList[listId].findIndex((t) => t.id === over.id);
            if (overIndex !== -1) {
                destinationListId = listId;
                newIndex = overIndex;
                break;
            }
        }

        // If over is a list (drop into empty list)
        if (newIndex === -1 && orderedLists.some((list) => list.id === over.id)) {
            destinationListId = over.id as string;
            newIndex = 0;
        }

        // Drop at the bottom if still not found
        if (newIndex === -1) {
            newIndex = (tasksByList[destinationListId]?.length ?? 0);
        }

        if (sourceListId === destinationListId && taskIndex === newIndex) return;

        // 3. Optimistic update
        const newTasks: Record<string, ITask[]> = {
            ...tasksByList,
            [sourceListId]: tasksByList[sourceListId].filter((t) => t.id !== task!.id),
            [destinationListId]: [...(tasksByList[destinationListId] || [])]
        };

        const movedTask: ITask = {...task, listId: destinationListId};
        newTasks[destinationListId].splice(newIndex, 0, movedTask);

        // Recalculate positions
        newTasks[destinationListId] = newTasks[destinationListId].map((t, i) => ({...t, position: i + 1}));

        setOptimisticTasks(newTasks);
        setIsLocalReordering(true);

        try {
            await moveTask(task.id, destinationListId, newIndex + 1);

            await Promise.all([
                fetchAllTasks(sourceListId),
                sourceListId !== destinationListId && fetchAllTasks(destinationListId)
            ]);
        } catch (error) {
            console.error("Failed to move task:", error);
            toast.error("Failed to move task");

            setOptimisticTasks(tasksByList);
            await Promise.all([
                fetchAllTasks(sourceListId),
                sourceListId !== destinationListId && fetchAllTasks(destinationListId)
            ]);
        } finally {
            setIsLocalReordering(false);
        }
    };

    return (
        <>
            <BoardsNavbar/>
            <div className="py-6 max-w-7xl mx-auto">
                {fetching && <LoadingSpinner message="Loading boards..."/>}

                {!fetching && !fetchError && orderedLists.length === 0 && (
                    <div className="text-center mt-20 text-gray-500">
                        <p className="text-lg">You don't have any lists in this board yet.</p>
                        <div className="mt-4">
                            <AddListModal board={selectedBoard}/>
                        </div>
                    </div>
                )}

                {!fetching && !fetchError && orderedLists.length > 0 && (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={(e) => {
                            if (activeTask) {
                                handleTaskDragEnd(e);
                            } else {
                                handleListDragEnd(e);
                            }
                        }}
                    >
                        <SortableContext
                            items={orderedLists.map((list) => list.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex gap-4 overflow-x-auto items-start p-2">
                                {orderedLists.map((list: IList) => (
                                    <SortableListCard
                                        key={list.id}
                                        board={selectedBoard}
                                        list={list}
                                        tasks={displayTasks[list.id] || []}
                                        tasksFetching={tasksFetching}
                                    />
                                ))}
                            </div>
                        </SortableContext>

                        <DragOverlay>
                            {activeList && (
                                <SortableListCard
                                    board={selectedBoard}
                                    list={activeList}
                                    tasks={displayTasks[activeList.id] || []}
                                    isDragging
                                />
                            )}
                            {activeTask && (
                                <div className="bg-white p-3 rounded shadow-md w-64">
                                    {activeTask.title}
                                </div>
                            )}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>
        </>
    );
};

export default Lists;