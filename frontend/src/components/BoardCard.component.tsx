import type {IBoard, IUserShort, IWorkspace} from "@/models";
import {Button} from "./ui/button";
import {ArrowRight, Ellipsis, Trash2} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {confirmDialog} from "@/utils/confirm-dailog.ts";
import toast from "react-hot-toast";
import {useAppDispatch} from "@/hooks.ts";
import {useBoardActions} from "@/hooks/useBoardsActions.ts";
import {setSelectedBoard} from "@/features/boards/selectedBoard.slice.ts";
import UpdateBoardModal from "@/components/modals/UpdateBoardModal.tsx";

interface BoardCardProps {
    board: IBoard;
    workspace: IWorkspace;
}

const BoardCard = ({board, workspace}: BoardCardProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    return (
        <div
            className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between gap-3 border hover:shadow-lg transition duration-200">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{board.name}</h2>
                <BoardCardMenu board={board} workspace={workspace}/>
            </div>

            <div className="flex flex-col justify-end">
                <h5 className="text-sm italic text-gray-700">Admin: {board?.owner?.name}</h5>
                <div className="flex justify-start gap-1">
                    <h5 className="text-sm italic text-gray-700">Members: </h5>
                    <ul>
                        {board.members?.map((member: IUserShort) => (
                            <li className="text-sm italic text-gray-700" key={member.id}>{member.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        dispatch(setSelectedBoard(board));
                        navigate(`/workspaces/${workspace.id}/boards/${board.id}/lists`)
                    }
                    }
                    className="flex items-center gap-1 hover:bg-gray-700 hover:cursor-pointer hover:text-white transition duration-200"
                >
                    Open <ArrowRight className="w-4 h-4"/>
                </Button>
            </div>
        </div>
    );
};

interface BoardCardMenuProps {
    board: IBoard;
    workspace: IWorkspace;
}

const BoardCardMenu = ({board, workspace}: BoardCardMenuProps) => {
    const {deleteBoard} = useBoardActions();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    /*to hide the menu if clicked outside the menu*/
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
            title: `Delete board "${board.name}"?`,
            text: "This action cannot be undone.",
            confirmButtonText: "Delete",
        });

        if (confirmed) {
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
            <button
                onClick={() => setOpen(prev => !prev)}
                className="px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
            >
                <Ellipsis/>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <UpdateBoardModal board={board} workspace={workspace} setOpen={setOpen}/>
                    <MenuItem
                        icon={Trash2}
                        label="Delete Board"
                        onClick={handleDelete}
                        className="text-red-500 hover:bg-red-100 w-full"
                    />
                </div>
            )}
        </div>
    )
}

export default BoardCard;