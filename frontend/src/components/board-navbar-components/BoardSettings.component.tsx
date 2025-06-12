import {useEffect, useRef, useState} from "react";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {Ellipsis, Trash} from "lucide-react";
import {toast} from "react-hot-toast";
import AddListModal from "@/components/modals/AddList.modal.tsx";
import type {IBoard, IWorkspace} from "@/models";
import UpdateBoardModal from "@/components/modals/UpdateBoardModal.tsx";
import {useBoardActions} from "@/hooks/useBoardsActions.ts";
import {confirmDialog} from "@/utils/confirm-dailog.ts";
import {useNavigate} from "react-router-dom";

interface BoardSettingsProps {
    board: IBoard;
    workspace: IWorkspace;
}

const BoardSettings = ({board, workspace}: BoardSettingsProps) => {
    const {deleteBoard} = useBoardActions();
    const navigate = useNavigate();

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
            title: `Delete Workspace "${workspace.name}"?`,
            text: "This action cannot be undone.",
            confirmButtonText: "Delete",
        });

        if (confirmed) {
            if (!board) return;
            const {success} = await deleteBoard(board.id);
            if (success) {
                navigate(`/workspaces/${workspace.id}/boards`);
            } else {
                toast.error("Could not delete board");
            }
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <MenuItem
                icon={Ellipsis}
                label="Show Menu"
                onClick={() => setOpen(prev => !prev)}
                className="rounded"
            />
            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <AddListModal board={board} isMenuModal={true}/>
                    <UpdateBoardModal board={board} workspace={workspace} setOpen={setOpen}/>
                    <MenuItem icon={Trash}
                              label="Delete Board"
                              onClick={handleDelete}
                              className="text-red-600 hover:bg-red-100 w-full"
                    />
                </div>
            )}
        </div>
    )
}

export default BoardSettings;