import * as React from "react";
import {useNavigate, Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks";
import {logout} from "../features/auth/auth.slice";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../app/store";
import {useEffect, useState} from "react";
import {createWorkspace, fetchWorkspaces} from "../features/workspaces/workspace.thunks";
import CreateWorkspaceModalComponent from "./CreateWorkspaceModal.component";
import type {IWorkspace} from "../models";

const NavbarComponent = () => {
    const userDispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);
    const token = useAppSelector(state => state.auth.token);

    const workspaceDispatch = useDispatch<AppDispatch>();
    const {workspaces, loading, error} = useSelector((state: RootState) => state.workspaces);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (token) {
            workspaceDispatch(fetchWorkspaces());
        }
    }, [workspaceDispatch, token]);

    const handleLogout = () => {
        userDispatch(logout());
        navigate("/login");
    }

    const handleWorkspaceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "create") {
            setModalOpen(true);
        } else {
            setSelectedWorkspaceId(value);
            navigate(`/workspaces/${value}`);
        }
    };

    const handleCreateWorkspace = async (name: string): Promise<void> => {
        try {
            const newWorkspace: IWorkspace = await workspaceDispatch(createWorkspace({name})).unwrap();
            setSelectedWorkspaceId(newWorkspace.id);
            navigate(`/workspaces/${newWorkspace.id}`);
        } catch (error) {
            console.error(error);
            alert("Failed to create workspace");
        }
    }

    return (
        <nav style={{padding: "1rem", borderBottom: "1px solid #ccc"}}>
            <Link to="/" style={{marginRight: "1rem"}}>Home</Link>
            {(token && user) ? (
                <>
                    <select
                        value={selectedWorkspaceId}
                        onChange={handleWorkspaceChange}
                        style={{marginRight: "1rem"}}
                    >
                        {error && (<option disabled>Error fetching workspaces</option>)}
                        {loading && (<option disabled>Loading...</option>)}

                        <option value="" disabled>Select Workspace</option>
                        <option value="create">➕ Create Workspace...</option>
                        {workspaces?.length > 0 && !error && !loading && (
                            <>
                                {workspaces.map((workspace) => (
                                    <option key={workspace.id} value={workspace.id}>
                                        {workspace.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>


                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login" style={{marginRight: "1rem"}}>Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}

            <CreateWorkspaceModalComponent
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateWorkspace}
            />
        </nav>
    );
};

export default NavbarComponent;