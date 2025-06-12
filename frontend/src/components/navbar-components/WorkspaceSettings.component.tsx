import {useEffect, useRef, useState} from "react";
import {Cog, Trash2} from "lucide-react";
import UpdateWorkspaceModal from "@/components/modals/UpdateWorkspaceModal.tsx";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {confirmDialog} from "@/utils/confirm-dailog.ts";
import toast from "react-hot-toast";
import {useWorkspaceActions} from "@/hooks/useWorkspaceActions.ts";
import {useNavigate} from "react-router-dom";
import type {IWorkspace} from "@/models";
import CreateBoardModal from "@/components/modals/CreateBoard.modal.tsx";

interface WorkspaceSettingsProps {
    workspace: IWorkspace;
}

const WorkspaceSettings = ({workspace}: WorkspaceSettingsProps) => {
    const {deleteWorkspace} = useWorkspaceActions();
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
            if (!workspace) return;
            const {success} = await deleteWorkspace(workspace.id);
            if (success) {
                navigate("/");
            } else {
                toast.error("Could not delete workspace");
            }
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <MenuItem
                onClick={() => setOpen(prev => !prev)}
                icon={Cog}
                className="rounded"
            />
            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <CreateBoardModal workspace={workspace} isMenuModal={true}/>
                    <UpdateWorkspaceModal workspace={workspace} setOpen={setOpen}/>
                    <MenuItem
                        icon={Trash2}
                        label="Delete Workspace"
                        onClick={handleDelete}
                        className="text-red-500 hover:bg-red-100 w-full"
                    />
                </div>

            )}
        </div>
    )
}

export default WorkspaceSettings;