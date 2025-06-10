import {useAppDispatch} from "../hooks.ts";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import type {RootState} from "../app/store.ts";
import {useEffect, useRef, useState} from "react";
import {createBoard, deleteBoard, fetchBoardsByWorkspaceId} from "../features/boards/board.thunks.ts";
import {setSelectedWorkspace} from "../features/workspaces/selectedWorkspace.slice.ts";
import {setSelectedBoard} from "../features/boards/selectedBoard.slice.ts";
import {toast} from "react-hot-toast";
import {handleApiError} from "../utils/handleApiError.ts";
import {Check, ChevronDown, Layers, Ellipsis, Calendar, Star, Menu, Earth, Plus, SquarePen, Trash} from "lucide-react";
import CreateListFormComponent from "./CreateListForm.component.tsx";

const BoardsNavbar = ({workspaceId = '', boardId = ''}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {workspaces} = useSelector((state: RootState) => state.workspaces);
    const {boardsByWorkspace, loading, error} = useSelector((state: RootState) => state.boards);

    const selectedBoard = useSelector((state: RootState) => state.selectedBoard)
    const [showDropdown, setShowDropdown] = useState(false);
    const [newBoardName, setNewBoardName] = useState("");

    const [deleteBoardError, setDeleteBoardError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!workspaceId) return;

            try {
                await dispatch(fetchBoardsByWorkspaceId({workspaceId})).unwrap();
            } catch (error) {
                console.error("Failed to load boards:", error);
            }
        }

        fetchData();
    }, [workspaceId, dispatch]);

    useEffect(() => {
        if (!workspaceId || !boardId) {
            dispatch(setSelectedWorkspace(null));
            dispatch(setSelectedBoard(null));
        }

    }, [workspaceId, boardId, dispatch]);

    useEffect(() => {
        if (!workspaceId) return;

        if (!selectedBoard && boardId && boardsByWorkspace[workspaceId]?.length > 0) {
            const board = boardsByWorkspace[workspaceId].find(board => board.id === boardId || board.id === boardId);
            if (board) {
                dispatch(setSelectedBoard(board));
            }
            const workspace = workspaces.find(workspace => workspace.id === workspaceId || workspace.id === workspaceId);
            if (workspace) {
                dispatch(setSelectedWorkspace(workspace));
            }
        }
    }, [boardId, boardsByWorkspace, workspaceId, selectedBoard, dispatch]);

    // Inside your Navbar component, before return:
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        }

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const handleSelectBoard = (boardId: string) => {
        if (!workspaceId) return;

        const board = boardsByWorkspace[workspaceId].find(board => board.id === boardId);

        if (board) {
            dispatch(setSelectedBoard(board));
            setShowDropdown(false);
            navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists`);
        }
    };

    const handleCreateBoard = () => {
        if (!workspaceId) return;
        if (newBoardName.trim() === "") return;
        dispatch(createBoard({name: newBoardName, workspaceId: workspaceId}))
            .unwrap()
            .then((newBoard) => {
                dispatch(setSelectedBoard(newBoard));
                setNewBoardName("");
                setShowDropdown(false);
                navigate(`/workspaces/${workspaceId}/boards/${newBoard.id}/lists`);
            });
    };

    const handleDeleteBoard = async () => {

        console.log("Board Id to delete: ", boardId);
        if (!boardId) return;

        const resultAction = await dispatch(deleteBoard({boardId}));

        if (deleteBoard.fulfilled.match(resultAction)) {
            toast.success("Board deleted successfully!");
            navigate(`/workspaces/${workspaceId}/boards`);
        } else {
            // console.error("Registration Error:", resultAction.payload);
            // If you want to set form errors from the API validation error,
            // you can call your handleApiError function here, passing the error payload.
            handleApiError(resultAction.payload, setDeleteBoardError);
        }
    }

    return (
        <nav className="p-2 border-b border-gray-300 flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-1 flex-1">
                {/* Workspace dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
                    >
                        <div className="flex items-center justify-center gap-1">
                            <span>Boards</span> <ChevronDown/>
                        </div>
                    </button>

                    {showDropdown && (
                        <BoardsDropDown
                            dropdownRef={dropdownRef}
                            boards={boardsByWorkspace[workspaceId]}
                            selectedBoard={selectedBoard}
                            handleSelectBoard={handleSelectBoard}
                            newBoardName={newBoardName}
                            setNewBoardName={setNewBoardName}
                            handleCreateBoard={handleCreateBoard}
                        />
                    )}
                </div>

                <PipeIcon/>

                {selectedBoard?.name && (
                    <>
                        <BoardNavbarItem
                            label={selectedBoard?.name}
                            onClick={() => console.log("Board Name clicked")}
                        />
                        <BoardNavbarItem icon={Star} onClick={() => console.log("Starred button clicked")}/>
                        <PipeIcon/>
                    </>
                )}


                <BoardNavbarItem icon={Menu} onClick={() => console.log("Menu clicked")}/>
                <BoardNavbarItem icon={Earth} label="Public" onClick={() => console.log("Public button clicked")}/>

                <PipeIcon/>

                <BoardNavbarItem label="Invite" onClick={() => console.log("Invite button clicked")}/>

            </div>

            {/* Right section */}
            <div className="flex items-center gap-1 flex-1 justify-end">
                <BoardNavbarItem icon={Calendar} label="Calendar" onClick={() => console.log("Show Menu clicked")}/>
                <BoardNavbarItem icon={Layers} label="Copy Board" onClick={() => console.log("Show Menu clicked")}/>
                <BoardSettings handleDeleteBoard={handleDeleteBoard}/>
            </div>
        </nav>

    )
}

const BoardsDropDown = ({
                            dropdownRef,
                            boards,
                            selectedBoard,
                            handleSelectBoard,
                            newBoardName,
                            setNewBoardName,
                            handleCreateBoard
                        }) => {
    return (
        <div
            ref={dropdownRef}
            className="absolute left-0 mt-1 w-64 bg-white border rounded shadow-lg z-10">
            <div className="p-2 border-b">
                <input
                    type="text"
                    placeholder="New board name"
                    className="w-full px-2 py-1 border rounded"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                />
                <button
                    onClick={handleCreateBoard}
                    className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 hover: cursor-pointer"
                >
                    Create Board
                </button>
            </div>
            <ul className="max-h-48 overflow-auto">
                {boards.map(board => (
                    <li key={board.id} className={`px-3 py-1`}>
                        <button
                            type="button"
                            className={`px-3 py-1 rounded w-full text-left cursor-pointer hover:bg-blue-100 flex items-center gap-2 text-gray-600`}
                            onClick={() => handleSelectBoard(board.id)}
                        >
                            {selectedBoard?.id === board.id ? (
                                <Check className="w-4 h-4 "/>
                            ) : (
                                <span className="w-4 h-4"></span>
                            )}
                            {board.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

interface BoardNavbarItemProps {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    label?: string;
    onClick?: () => void;
    className?: string;
}

const BoardNavbarItem = ({icon: Icon, label, onClick, className}: BoardNavbarItemProps) => {
    return (
        <div
            onClick={onClick}
            className={`px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200
            flex items-center text-sm text-gray-700 text-left ${className ?? ""}`}
        >
            {Icon && !label && <Icon className="w-5 h-5"/>}
            {Icon && label && <Icon className="w-4 h-4 mr-2"/>}
            {label ?? ''}
        </div>
    )
}

const PipeIcon = ({className = ''}: { className?: string }) => {
    return (
        <span className={`mx-2 text-gray-500 ${className ?? ''}`}>|</span>
    )
}

const BoardSettings = ({handleDeleteBoard}: { handleDeleteBoard: () => void }) => {
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

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className={`rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200
            flex items-center text-sm text-gray-700 text-left`}
            >
                <BoardNavbarItem icon={Ellipsis} label="Show Menu"/>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <AddListButton icon={Plus} label="Add List" className=""/>
                    <ProfileMenuItem icon={SquarePen} label="Edit Board"
                                     onClick={() => console.log("Edit Board button clicked")}/>
                    <ProfileMenuItem icon={Trash} label="Delete Board" onClick={handleDeleteBoard}
                                     className="text-red-600 hover:bg-red-100"/>
                </div>
            )}
        </div>
    )
}

interface ProfileMenuItemProps {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    onClick?: () => void;
    className?: string;
}

const ProfileMenuItem = ({icon: Icon, label, onClick, className}: ProfileMenuItemProps) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-2 text-sm text-gray-700 hover: cursor-pointer hover:bg-gray-100 w-full text-left ${className ?? ""}`}
    >
        <Icon className="w-4 h-4 mr-2"/>
        {label}
    </button>
);

const AddListButton = ({icon: Icon, label, className}) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const selectedBoard = useSelector((state: RootState) => state.selectedBoard);
    const boardId = selectedBoard?.id ?? '';

    return (<>
            <button
                onClick={handleOpen}
                className={`flex items-center px-4 py-2 text-sm text-gray-700 hover: cursor-pointer hover:bg-gray-100 w-full text-left ${className ?? ""}`}
            >
                <Icon className="w-4 h-4 mr-2"/>
                {label}
            </button>

            <Modal isOpen={isModalOpen} onClose={handleClose}>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New List</h2>
                <CreateListFormComponent boardId={boardId} setModalOpen={setModalOpen}/>
            </Modal>
        </>
    )
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({isOpen, onClose, children}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default BoardsNavbar;
