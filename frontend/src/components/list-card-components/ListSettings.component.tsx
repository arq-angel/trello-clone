import {useEffect, useRef, useState} from "react";
import {Ellipsis, Trash} from "lucide-react";
import type {IBoard, IList} from "@/models";
import {useListActions} from "@/hooks/useListActions.ts";
import {confirmDialog} from "@/utils/confirm-dailog.ts";
import {toast} from "react-hot-toast";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import AddTaskModal from "@/components/modals/AddTask.modal.tsx";
import UpdateListModal from "@/components/modals/UpdateListModal.tsx";

interface ListSettingsProps {
    list: IList;
    board: IBoard;
}

const ListSettings = ({list, board}: ListSettingsProps) => {
    const {deleteList} = useListActions();

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

    const handleDelete = async () => {
        const confirmed = await confirmDialog({
            title: `Delete List "${list.name}"?`,
            text: "This action cannot be undone.",
            confirmButtonText: "Delete",
        });

        if (confirmed) {
            if (!list) return;
            const {success} = await deleteList(list.id);
            if (!success) toast.error("Could not delete list");
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <MenuItem
                icon={Ellipsis}
                onClick={() => {
                    console.log("Hello")
                    setOpen(prev => !prev)
                }}
                className="rounded"
            />
            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <AddTaskModal list={list} isMenuModal={true} setOpen={setOpen} />
                    <UpdateListModal list={list} board={board} setOpen={setOpen} />
                    <MenuItem icon={Trash}
                              label="Delete List"
                              onClick={handleDelete}
                              className="text-red-600 hover:bg-red-100 w-full"
                    />
                </div>
            )}
        </div>
    )
}

export default ListSettings;