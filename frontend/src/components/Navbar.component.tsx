import {useNavigate, Link, useMatch} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../app/store.ts";
import {useEffect, useState} from "react";
import {setSelectedWorkspace} from "../features/workspaces/selectedWorkspace.slice.ts";
import {
    House,
    Search,
    Plus,
    Info,
    Bell,
    Layers,
} from "lucide-react";
import WorkspacesDropDown from "@/components/navbar-components/WorkspacesDropdown.component.tsx";
import ProfileMenu from "@/components/navbar-components/ProfileMenu.component.tsx";
import WorkspaceSettings from "@/components/navbar-components/WorkspaceSettings.component.tsx";
import UnAuthenticatedNavbar from "@/components/navbar-components/UnAuthenticatedNavbar.tsx";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {useWorkspaceActions} from "@/hooks/useWorkspaceActions.ts";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const match = useMatch("/workspaces/:workspaceId/*");
    const workspaceId = match?.params.workspaceId;

    const user = useAppSelector(state => state.auth.user);
    const token = useAppSelector(state => state.auth.token);

    const {fetchAllWorkspaces} = useWorkspaceActions();
    useEffect(() => {
        const fetchData = async () => {
            if (!user && !token) return;
            await fetchAllWorkspaces();
        }
        fetchData();
    }, [user, token, fetchAllWorkspaces]);

    const {workspaces} = useSelector((state: RootState) => state.workspaces);

    const selectedWorkspace = useSelector((state: RootState) => state.selectedWorkspace);

    useEffect(() => {
        if (!workspaceId) {
            dispatch(setSelectedWorkspace(null));
        }
    }, [workspaceId, dispatch]);

    useEffect(() => {
        if (!selectedWorkspace && workspaceId && workspaces.length > 0) {
            const workspace = workspaces.find(workspace => workspace.id === workspaceId);
            if (workspace) {
                dispatch(setSelectedWorkspace(workspace));
            }
        }
    }, [workspaceId, workspaces, selectedWorkspace, dispatch]);

    const handleSelectWorkspace = (workspaceId: string) => {
        if (!workspaceId) return;
        const workspace = workspaces.find(w => w.id === workspaceId);
        if (workspace) {
            dispatch(setSelectedWorkspace(workspace));
            navigate(`/workspaces/${workspaceId}/boards`);
        }
    };

    // User not authenticated, don't show workspace selector
    if (!token || !user) return <UnAuthenticatedNavbar/>;

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
                    <WorkspacesDropDown
                        workspaces={workspaces}
                        selectedWorkspace={selectedWorkspace}
                        handleSelectWorkspace={handleSelectWorkspace}
                    />
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
                <MenuItem
                    icon={Plus}
                    onClick={() => console.log("Plus button clicked")}
                    className="rounded"
                />
                <MenuItem
                    icon={Info}
                    onClick={() => console.log("Info button clicked")}
                    className="rounded"
                />
                <MenuItem
                    icon={Bell}
                    onClick={() => console.log("Bell button clicked")}
                    className="rounded"
                />
                {selectedWorkspace && (<WorkspaceSettings workspace={selectedWorkspace}/>)}
                {user && token && (<ProfileMenu/>)}
            </div>
        </nav>
    );
};


export default Navbar;
