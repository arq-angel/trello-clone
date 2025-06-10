import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchWorkspaces, createWorkspace } from "../features/workspaces/workspace.thunks";
import { Plus } from "lucide-react";

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const { workspaces, loading } = useAppSelector((state) => state.workspaces);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        dispatch(fetchWorkspaces());
    }, [dispatch]);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        await dispatch(createWorkspace({ name: newName }));
        setNewName("");
    };

    return (
        <aside className="w-64 p-4 bg-white border-r">
            <h2 className="text-lg font-bold mb-4">Workspaces</h2>

            <ul className="space-y-2 mb-4">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    workspaces.map((ws) => (
                        <li key={ws.id} className="text-sm p-2 rounded hover:bg-gray-100 cursor-pointer">
                            {ws.name}
                        </li>
                    ))
                )}
            </ul>

            <div className="space-y-2">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New workspace name"
                    className="w-full p-2 border rounded text-sm"
                />
                <button
                    onClick={handleCreate}
                    className="mb-3 flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                >
                    <Plus size={16} /> Create
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
