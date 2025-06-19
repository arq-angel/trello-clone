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

const DemoLists = () => {
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
    const {fetchAllTasks, moveTask, updateTaskPosition} = useTaskActions();

    // Only store IDs in local state
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [isLocalReordering, setIsLocalReordering] = useState(false);
    const [orderedListIds, setOrderedListIds] = useState<string[]>([]);
    const [optimisticTasksByList, setOptimisticTasksByList] = useState<Record<string, ITask[]>>({});
    const [pendingTaskUpdates, setPendingTaskUpdates] = useState<Set<string>>(new Set());

    // Get actual objects from Redux using IDs
    const listsFromRedux = useMemo(() => listsByBoard[boardId] ?? [], [listsByBoard, boardId]);
    const lastSyncedRef = useRef<string[]>([]);

    // Derive ordered lists from Redux data using local ID order
    const orderedLists = useMemo(() => {
        if (orderedListIds.length === 0) return listsFromRedux;

        const listMap = new Map(listsFromRedux.map(list => [list.id, list]));
        return orderedListIds.map(id => listMap.get(id)).filter(Boolean) as IList[];
    }, [listsFromRedux, orderedListIds]);

    // Get active objects from Redux
    const activeList = useMemo(() => {
        if (!activeListId) return null;
        return listsFromRedux.find(list => list.id === activeListId) || null;
    }, [activeListId, listsFromRedux]);

    const activeTask = useMemo(() => {
        if (!activeTaskId) return null;

        // First check optimistic state
        if (Object.keys(optimisticTasksByList).length > 0) {
            for (const listId in optimisticTasksByList) {
                const task = optimisticTasksByList[listId].find(t => t.id === activeTaskId);
                if (task) return task;
            }
        }

        // Fallback to Redux state
        for (const listId in tasksByList) {
            const task = tasksByList[listId].find(t => t.id === activeTaskId);
            if (task) return task;
        }
        return null;
    }, [activeTaskId, optimisticTasksByList, tasksByList]);

    // Determine which tasks to display - prioritize optimistic state for affected lists only
    const displayTasks = useMemo(() => {
        if (Object.keys(optimisticTasksByList).length === 0) {
            return tasksByList;
        }

        // Merge optimistic and Redux state - only use optimistic for lists that have updates
        const result: Record<string, ITask[]> = {};

        // Start with all Redux lists
        for (const listId in tasksByList) {
            if (optimisticTasksByList[listId]) {
                // Use optimistic state for this list
                result[listId] = optimisticTasksByList[listId];
            } else {
                // Use Redux state for unaffected lists
                result[listId] = tasksByList[listId];
            }
        }

        // Add any new optimistic lists that don't exist in Redux yet
        for (const listId in optimisticTasksByList) {
            if (!result[listId]) {
                result[listId] = optimisticTasksByList[listId];
            }
        }

        return result;
    }, [optimisticTasksByList, tasksByList]);

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

        const reduxIds = listsFromRedux.map(l => l.id);
        const reduxIdsStr = reduxIds.join(",");
        const localIdsStr = lastSyncedRef.current.join(",");

        if (reduxIdsStr !== localIdsStr) {
            setOrderedListIds(reduxIds);
            lastSyncedRef.current = reduxIds;
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

    // Clear optimistic state when Redux state updates and we're not actively dragging
    useEffect(() => {
        if (!isLocalReordering && !activeTaskId && Object.keys(optimisticTasksByList).length > 0) {
            // Only clear if no pending updates for the affected lists
            const hasNoPendingUpdates = Object.keys(optimisticTasksByList).every(listId =>
                !pendingTaskUpdates.has(listId)
            );

            if (hasNoPendingUpdates) {
                setOptimisticTasksByList({});
            }
        }
    }, [tasksByList, isLocalReordering, activeTaskId, optimisticTasksByList, pendingTaskUpdates]);

    async function handleListDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        setActiveListId(null);

        if (!active || !over || active.id === over.id) return;

        const oldIndex = orderedListIds.findIndex(id => id === active.id);
        const newIndex = orderedListIds.findIndex(id => id === over.id);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const newOrderIds = arrayMove(orderedListIds, oldIndex, newIndex);
        setOrderedListIds(newOrderIds);
        lastSyncedRef.current = newOrderIds;
        setIsLocalReordering(true);

        try {
            // Update positions for all lists based on new order
            const listsToUpdate = newOrderIds.map((listId, index) => ({
                listId,
                newPosition: index + 1
            }));

            // Update all list positions in parallel
            await Promise.all(
                listsToUpdate.map(({listId, newPosition}) =>
                    moveList(listId, newPosition)
                )
            );

            await fetchAllLists(boardId);
            setIsLocalReordering(false);
        } catch (error) {
            console.error("Failed to update list positions:", error);
            toast.error("Failed to save list order. Please try again.");
            const fallbackIds = listsFromRedux.map(l => l.id);
            setOrderedListIds(fallbackIds);
            lastSyncedRef.current = fallbackIds;
            setIsLocalReordering(false);
        }
    }

    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;
        if (!active) return;

        // Check if it's a list
        const isListId = orderedListIds.includes(active.id as string);
        if (isListId) {
            setActiveListId(active.id as string);
            return;
        }

        // Check if it's a task - check both optimistic and Redux state
        let taskFound = false;

        // Check optimistic state first
        if (Object.keys(optimisticTasksByList).length > 0) {
            for (const listId in optimisticTasksByList) {
                const taskExists = optimisticTasksByList[listId].some(t => t.id === active.id);
                if (taskExists) {
                    setActiveTaskId(active.id as string);
                    taskFound = true;
                    break;
                }
            }
        }

        // Fallback to Redux state
        if (!taskFound) {
            for (const listId in tasksByList) {
                const taskExists = tasksByList[listId].some(t => t.id === active.id);
                if (taskExists) {
                    setActiveTaskId(active.id as string);
                    break;
                }
            }
        }
    };

    const handleTaskDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;
        setActiveTaskId(null);

        if (!active || !over || active.id === over.id) return;

        // Use displayTasks (which includes optimistic state) to find the task
        let sourceListId = "";
        let task: ITask | null = null;
        let taskIndex = -1;

        for (const listId in displayTasks) {
            const foundIndex = displayTasks[listId].findIndex((t) => t.id === active.id);
            if (foundIndex !== -1) {
                sourceListId = listId;
                task = displayTasks[listId][foundIndex];
                taskIndex = foundIndex;
                break;
            }
        }

        if (!task || !sourceListId) return;

        // Determine destination list
        let destinationListId = sourceListId;
        let newIndex = -1;

        // If over is a task, get its list
        for (const listId in displayTasks) {
            const overIndex = displayTasks[listId].findIndex((t) => t.id === over.id);
            if (overIndex !== -1) {
                destinationListId = listId;
                newIndex = overIndex;
                break;
            }
        }

        // If over is a list directly
        if (destinationListId === sourceListId && orderedListIds.includes(over.id as string)) {
            destinationListId = over.id as string;
            newIndex = displayTasks[destinationListId]?.length || 0;
        }

        // If moving to a different list and no specific position found, place at the end
        if (sourceListId !== destinationListId && newIndex === -1) {
            newIndex = displayTasks[destinationListId]?.length || 0;
        }

        // Skip if no actual change
        if (sourceListId === destinationListId && taskIndex === newIndex) return;

        // Mark lists as having pending updates
        const newPendingUpdates = new Set(pendingTaskUpdates);
        newPendingUpdates.add(sourceListId);
        if (sourceListId !== destinationListId) {
            newPendingUpdates.add(destinationListId);
        }
        setPendingTaskUpdates(newPendingUpdates);

        // Create optimistic update
        const newOptimisticTasks: Record<string, ITask[]> = {...optimisticTasksByList};

        if (sourceListId !== destinationListId) {
            // Cross-list move
            const sourceTasks = displayTasks[sourceListId] || [];
            const destTasks = displayTasks[destinationListId] || [];

            // Remove from source
            newOptimisticTasks[sourceListId] = sourceTasks.filter(t => t.id !== task.id);

            // Add to destination at specific position
            const newDestTasks = [...destTasks];
            newDestTasks.splice(newIndex, 0, task);
            newOptimisticTasks[destinationListId] = newDestTasks;
        } else {
            // Same list reordering
            const currentTasks = displayTasks[sourceListId] || [];
            newOptimisticTasks[sourceListId] = arrayMove(currentTasks, taskIndex, newIndex);
        }

        setOptimisticTasksByList(newOptimisticTasks);
        setIsLocalReordering(true);

        try {
            if (sourceListId !== destinationListId) {
                await handleCrossListMove(task, sourceListId, destinationListId, taskIndex, newIndex);
            } else {
                await handleSameListMove(sourceListId, taskIndex, newIndex);
            }

            // Refresh affected lists
            const refreshPromises = [fetchAllTasks(sourceListId)];
            if (sourceListId !== destinationListId) {
                refreshPromises.push(fetchAllTasks(destinationListId));
            }

            await Promise.all(refreshPromises);

        } catch (error) {
            console.error("Failed to move task:", error);
            toast.error("Failed to move task");

            // Refresh on error to get clean state
            const refreshPromises = [fetchAllTasks(sourceListId)];
            if (sourceListId !== destinationListId) {
                refreshPromises.push(fetchAllTasks(destinationListId));
            }
            await Promise.all(refreshPromises);
        } finally {
            setIsLocalReordering(false);

            // Remove pending update flags
            const updatedPendingUpdates = new Set(pendingTaskUpdates);
            updatedPendingUpdates.delete(sourceListId);
            if (sourceListId !== destinationListId) {
                updatedPendingUpdates.delete(destinationListId);
            }
            setPendingTaskUpdates(updatedPendingUpdates);
        }
    };

    // Helper function to handle cross-list moves
    const handleCrossListMove = async (
        task: ITask,
        sourceListId: string,
        destinationListId: string,
        oldIndex: number,
        newIndex: number
    ) => {
        const sourceTasks = tasksByList[sourceListId] || [];
        const destinationTasks = tasksByList[destinationListId] || [];

        // Calculate positions based on the intended final arrangement
        const finalDestinationPosition = newIndex + 1;

        // 1. Move the main task to destination list at the correct position
        await moveTask(task.id, destinationListId, finalDestinationPosition);

        // 2. Update positions of tasks that need to shift in destination list
        const destTasksToUpdate = destinationTasks
            .slice(newIndex) // Tasks at and after the insertion point
            .map((t, index) => ({
                taskId: t.id,
                newPosition: finalDestinationPosition + 1 + index // Shift positions
            }));

        // 3. Update positions of remaining tasks in source list (close the gap)
        const sourceTasksToUpdate = sourceTasks
            .filter((t, index) => index > oldIndex) // Tasks after the moved task
            .map((t, index) => ({
                taskId: t.id,
                newPosition: oldIndex + 1 + index // Fill the gap
            }));

        // Update all positions in parallel
        const allUpdates = [...destTasksToUpdate, ...sourceTasksToUpdate];
        if (allUpdates.length > 0) {
            await Promise.all(
                allUpdates.map(({taskId, newPosition}) =>
                    updateTaskPosition ? updateTaskPosition(taskId, newPosition) :
                        moveTask(taskId, taskId === task.id ? destinationListId : sourceListId, newPosition)
                )
            );
        }
    };

    // Helper function to handle same-list moves
    const handleSameListMove = async (listId: string, oldIndex: number, newIndex: number) => {
        const tasks = displayTasks[listId] || [];
        const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);

        // Update positions for all tasks to match new order
        const tasksToUpdate = reorderedTasks.map((task, index) => ({
            taskId: task.id,
            newPosition: index + 1
        }));

        // Update all positions in parallel
        await Promise.all(
            tasksToUpdate.map(({taskId, newPosition}) =>
                updateTaskPosition ? updateTaskPosition(taskId, newPosition) : moveTask(taskId, listId, newPosition)
            )
        );
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
                            if (activeTaskId) {
                                handleTaskDragEnd(e);
                            } else {
                                handleListDragEnd(e);
                            }
                        }}
                    >
                        <SortableContext
                            items={orderedListIds}
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

export default DemoLists;