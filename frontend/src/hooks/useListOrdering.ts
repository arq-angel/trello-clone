import {useState, useEffect, useMemo, useRef} from "react";
import {toast} from "react-hot-toast";
import {arrayMove} from "@dnd-kit/sortable";
import type {IList} from "@/models";
import type {DragEndEvent} from "@dnd-kit/core";

export function useListOrdering({listsByBoard, boardId, fetchAllLists, moveList}) {
    const [activeList, setActiveList] = useState<IList | null>(null);
    const [isLocalReordering, setIsLocalReordering] = useState(false);

    const listsFromRedux = useMemo(() => listsByBoard[boardId] ?? [], [listsByBoard, boardId]);

    const lastSyncedRef = useRef<IList[]>(listsFromRedux);
    const [orderedLists, setOrderedLists] = useState(listsFromRedux);

    useEffect(() => {
        if (boardId) fetchAllLists(boardId);
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



    async function handleDragEnd(event: DragEndEvent) {
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

    return {
        activeList,
        setActiveList,
        orderedLists,
        handleDragEnd,
    };
}