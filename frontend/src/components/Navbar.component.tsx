import {useNavigate, Link, useMatch} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {logout} from "../features/auth/auth.slice";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../app/store.ts";
import {useEffect, useRef, useState} from "react";
import {fetchWorkspaces, createWorkspace, deleteWorkspace} from "../features/workspaces/workspace.thunks.ts";
import {setSelectedWorkspace} from "../features/workspaces/selectedWorkspace.slice.ts";
import {toast} from "react-hot-toast";
import {handleApiError} from "../utils/handleApiError.ts";
import {
    Check,
    ChevronDown,
    House,
    Search,
    User,
    Plus,
    Info,
    Cog,
    Bell,
    Settings,
    Layers,
    Moon,
    HelpCircle,
    CreditCard,
    Activity,
    LogOut,
    Trash,
    SquarePen,
} from "lucide-react";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);
    const token = useAppSelector(state => state.auth.token);

    const workspaceDispatch = useDispatch<AppDispatch>();
    const {workspaces} = useSelector((state: RootState) => state.workspaces);
    const selectedWorkspace = useSelector((state: RootState) => state.selectedWorkspace);

    const [showDropdown, setShowDropdown] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [deleteWorkspaceError, setDeleteWorkspaceError] = useState(null);

    const match = useMatch("/workspaces/:workspaceId/*");
    const workspaceId = match?.params.workspaceId;

    useEffect(() => {
        if (!workspaceId) {
            // Not on workspace route, clear selected workspace
            dispatch(setSelectedWorkspace(null));
        }
    }, [workspaceId, dispatch]);

    useEffect(() => {
        if (!selectedWorkspace && workspaceId && workspaces.length > 0) {
            const workspace = workspaces.find(workspace => workspace.id === workspaceId || workspace.id === workspaceId);
            if (workspace) {
                dispatch(setSelectedWorkspace(workspace));
            }
        }
    }, [workspaceId, workspaces, selectedWorkspace, dispatch]);

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

    useEffect(() => {
        if (token) {
            workspaceDispatch(fetchWorkspaces());
        }
    }, [token, workspaceDispatch]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(setSelectedWorkspace(null));
        navigate("/login");
    };

    const handleSelectWorkspace = (workspaceId: string) => {
        const ws = workspaces.find(w => w.id === workspaceId);
        if (ws) {
            dispatch(setSelectedWorkspace(ws));
            setShowDropdown(false);
            navigate(`/workspaces/${workspaceId}/boards`);
        }
    };

    const handleCreateWorkspace = () => {
        if (newWorkspaceName.trim() === "") return;
        workspaceDispatch(createWorkspace({name: newWorkspaceName}))
            .unwrap()
            .then((newWs) => {
                dispatch(setSelectedWorkspace(newWs));
                setNewWorkspaceName("");
                setShowDropdown(false);
                navigate(`/workspaces/${newWs.id}/boards`);
            });
    };

    const handleDeleteWorkspace = async () => {
        console.log("Delete workspace here", selectedWorkspace.id);

        const selectedWorkspaceId = selectedWorkspace.id;

        const resultAction = await dispatch(deleteWorkspace({workspaceId: selectedWorkspaceId}));

        if (deleteWorkspace.fulfilled.match(resultAction)) {
            navigate(`/`);
            toast.success("Workspace deleted successfully!");
        } else {
            handleApiError(resultAction.payload, setDeleteWorkspaceError);
        }

    }

    if (!token || !user) {
        // User not authenticated, don't show workspace selector
        return (
            <nav className="p-4 border-b border-gray-300 flex items-center">
                <Link
                    to="/"
                    className="mr-4 font-semibold text-lg text-blue-500"
                >Dashboard</Link>
                <div className="ml-auto">
                    <Link
                        to="/login"
                        className="mr-4 ml-auto px-3 py-1 border border-blue-500 rounded text-blue-500 hover:bg-blue-500 hover:text-white hover: cursor-pointer transition-colors duration-200"
                    >Login</Link>
                    <Link
                        to="/register"
                        className="ml-auto px-3 py-1 border border-blue-500 rounded text-blue-500 hover:bg-blue-500 hover:text-white hover: cursor-pointer transition-colors duration-200"
                    >Register</Link>
                </div>
            </nav>
        );
    }

    // Authenticated UI with workspace dropdown
    return (
        <nav className="p-2 border-b border-gray-300 flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-1 flex-1">
                <Link
                    to="/"
                    onClick={() => {
                        dispatch(setSelectedWorkspace(null));
                    }}
                    className="px-3 py-1 font-semibold text-lg text-blue-500 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
                >
                    <House/>
                </Link>

                {/* Workspace dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
                    >
                        <div className="flex items-center justify-center gap-1">
                            <span>Workspaces</span> <ChevronDown/>
                        </div>
                    </button>

                    {showDropdown && (
                        <WorkspacesDropDown
                            dropdownRef={dropdownRef}
                            workspaces={workspaces}
                            selectedWorkspace={selectedWorkspace}
                            handleSelectWorkspace={handleSelectWorkspace}
                            newWorkspaceName={newWorkspaceName}
                            setNewWorkspaceName={setNewWorkspaceName}
                            handleCreateWorkspace={handleCreateWorkspace}
                        />
                    )}
                </div>

                {/* Search input */}
                <div className="relative w-42">
                    <input
                        type="text"
                        placeholder=""
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-3 pr-8 py-1 border border-gray-400/50 rounded text-sm shadow-sm outline-none"
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                </div>
            </div>

            {/* Center section – logo */}
            <div
                className="flex-0 flex items-center justify-center gap-2 text-center font-bold text-md"
            >
                <Layers className="w-5 h-5 "/>
                <p className="m-0">Trello</p>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-1 flex-1 justify-end">
                <button
                    onClick={() => {
                        console.log("Plus button pressed")
                    }}
                    className="px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
                >
                    <Plus className="w-5 h-5 text-gray-700"/>
                </button>
                <button
                    onClick={() => {
                        console.log("Info button pressed")
                    }}
                    className="px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
                >
                    <Info className="w-5 h-5 text-gray-700"/>
                </button>
                <button
                    onClick={() => {
                        console.log("Notification button pressed")
                    }}
                    className="px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
                >
                    <Bell className="w-5 h-5 text-gray-700"/>
                </button>
                <WorkspaceSettings handleDeleteWorkspace={handleDeleteWorkspace}/>
                <ProfileMenu handleLogout={handleLogout}/>
            </div>
        </nav>
    );
};

const WorkspacesDropDown = ({
                                dropdownRef,
                                workspaces,
                                selectedWorkspace,
                                handleSelectWorkspace,
                                newWorkspaceName,
                                setNewWorkspaceName,
                                handleCreateWorkspace
                            }) => {
    return (
        <div
            ref={dropdownRef}
            className="absolute left-0 mt-1 w-64 bg-white border rounded shadow-lg z-10">
            <div className="p-2 border-b">
                <input
                    type="text"
                    placeholder="New workspace name"
                    className="w-full px-2 py-1 border rounded"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                />
                <button
                    onClick={handleCreateWorkspace}
                    className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 hover: cursor-pointer"
                >
                    Create Workspace
                </button>
            </div>
            <ul className="max-h-48 overflow-auto">
                {workspaces.map(ws => (
                    <li key={ws.id} className={`px-3 py-1`}>
                        <button
                            type="button"
                            className={`px-3 py-1 rounded w-full text-left cursor-pointer hover:bg-blue-100 flex items-center gap-2 text-gray-600`}
                            onClick={() => handleSelectWorkspace(ws.id)}
                        >
                            {selectedWorkspace?.id === ws.id ? (
                                <Check className="w-4 h-4 "/>
                            ) : (
                                <span className="w-4 h-4"></span>
                            )}
                            {ws.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const WorkspaceSettings = ({handleDeleteWorkspace}: { handleDeleteWorkspace: () => void }) => {
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
                className="px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
            >
                <Cog className="w-5 h-5 text-gray-700"/>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <ProfileMenuItem icon={SquarePen} label="Edit Workspace"
                                     onClick={() => console.log("Edit Workspace button clicked")}/>
                    <ProfileMenuItem icon={Trash} label="Delete Workspace" onClick={handleDeleteWorkspace}
                                     className="text-red-600 hover:bg-red-100"/>
                </div>
            )}
        </div>
    )
}

const ProfileMenu = ({handleLogout}: { handleLogout: () => void }) => {
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
                className="px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
            >
                <User className="w-5 h-5 text-gray-700"/>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <ProfileMenuItem icon={User} label="Personal Details"
                                     onClick={() => console.log("Personal Details clicked")}/>
                    <ProfileMenuItem icon={Settings} label="Account Settings"
                                     onClick={() => console.log("Account Settings clicked")}/>
                    <ProfileMenuItem icon={Bell} label="Notification Settings"
                                     onClick={() => console.log("Notification Settings clicked")}/>
                    <ProfileMenuItem icon={Moon} label="Appearance" onClick={() => console.log("Appearance clicked")}/>
                    <ProfileMenuItem icon={HelpCircle} label="Help & Support"
                                     onClick={() => console.log("Help & Support clicked")}/>
                    <ProfileMenuItem icon={CreditCard} label="Billing" onClick={() => console.log("Billing clicked")}/>
                    <ProfileMenuItem icon={Activity} label="Activity Log"
                                     onClick={() => console.log("Activity Log clicked")}/>
                    <ProfileMenuItem icon={LogOut} label="Logout" onClick={handleLogout}
                                     className="text-red-600 hover:bg-red-100"/>
                </div>
            )}
        </div>
    );
};

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

export default Navbar;
