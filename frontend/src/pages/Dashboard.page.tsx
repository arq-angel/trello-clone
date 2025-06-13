import {useEffect} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "../app/store.ts";
import {toast} from "react-hot-toast";
import WorkspaceCard from "../components/WorkspaceCard.component.tsx";
import CreateWorkspaceModal from "@/components/modals/CreateWorkspace.modal.tsx";
import LoadingSpinner from "@/components/ui-components/LoadingSpinner.component.tsx";

const Dashboard = () => {
    const {workspaces, fetching, fetchError} = useSelector((state: RootState) => state.workspaces);

    /* if error occurs while fetching workspaces */
    useEffect(() => {
        if (fetchError) {
            toast.error(fetchError);
        }
    }, [fetchError]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Your Workspaces</h1>
                <CreateWorkspaceModal/>
            </div>

            {/* Loading state */}
            {fetching && <LoadingSpinner message="Loading workspaces..."/>}

            {/* Empty state */}
            {!fetching && !fetchError && workspaces.length === 0 && (
                <div className="text-center mt-20 text-gray-500">
                    <p className="text-lg">You don’t have any workspaces yet.</p>
                    <div className="mt-4">
                        <CreateWorkspaceModal/>
                    </div>
                </div>
            )}

            {/* Workspace cards */}
            {!fetching && !fetchError && workspaces.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {workspaces.map((workspace) => (
                        <WorkspaceCard key={workspace.id} workspace={workspace}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
