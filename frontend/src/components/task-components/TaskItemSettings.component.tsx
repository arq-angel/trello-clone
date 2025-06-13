import type {IList, ITask} from "@/models";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {Ellipsis, Trash} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import AddCommentModal from "@/components/modals/AddComment.modal.tsx";
import {confirmDialog} from "@/utils/confirm-dailog.ts";
import {toast} from "react-hot-toast";
import {useTaskActions} from "@/hooks/useTaskActions.ts";
import UpdateTaskModal from "@/components/modals/UpdateTaskModal.tsx";


interface TaskItemSettingsProps {
    task: ITask;
    list: IList;
}

const TaskItemSettings = ({task, list}: TaskItemSettingsProps) => {
    const {deleteTask} = useTaskActions();

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
            title: `Delete Task "${task.title}"?`,
            text: "This action cannot be undone.",
            confirmButtonText: "Delete",
        });

        if (confirmed) {
            if (!task) return;
            const {success} = await deleteTask(task.id);
            if (!success) toast.error("Could not delete task");
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <MenuItem
                icon={Ellipsis}
                onClick={() => setOpen(prev => !prev)}
                className="rounded"
            />
            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <AddCommentModal task={task} isMenuModal={true} setOpen={setOpen} />
                    <UpdateTaskModal task={task} list={list} setOpen={setOpen} />
                    <MenuItem icon={Trash}
                              label="Delete Task"
                              onClick={handleDelete}
                              className="text-red-600 hover:bg-red-100 w-full"
                    />
                </div>
            )}
        </div>
    );
};

export default TaskItemSettings;