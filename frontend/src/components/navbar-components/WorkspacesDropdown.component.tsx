import type {IWorkspace} from "@/models";
import {Check, ChevronDown} from "lucide-react";
import {useEffect, useState, useRef} from "react";
import {setSelectedWorkspace} from "@/features/workspaces/selectedWorkspace.slice.ts";
import {useAppDispatch} from "@/hooks.ts";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useWorkspaceActions} from "@/hooks/useWorkspaceActions.ts";

interface WorkspacesDropdownProps {
    workspaces: IWorkspace[];
    selectedWorkspace: IWorkspace;
    handleSelectWorkspace: (workspaceId: string) => void;
}

interface FormValues {
    name: string;
}

const WorkspacesDropDown = ({workspaces, selectedWorkspace, handleSelectWorkspace}: WorkspacesDropdownProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);

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

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<FormValues>();

    const {createWorkspace} = useWorkspaceActions(setError);

    const onSubmit = async (data: FormValues) => {
        const {success, data: newWorkspace} = await createWorkspace(data.name.trim());
        if (!newWorkspace) return;
        if (success) {
            dispatch(setSelectedWorkspace(newWorkspace));
            navigate(`/workspaces/${newWorkspace.id}/boards`);
            reset();
        }
    };

    return (
        <>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-3 py-1 rounded hover:bg-gray-200 hover:cursor-pointer transition-colors duration-200"
            >
                <div className="flex items-center justify-center gap-1">
                    <span>Workspaces</span> <ChevronDown/>
                </div>
            </button>
            {showDropdown && (

                <div
                    ref={dropdownRef}
                    className="absolute left-0 mt-1 w-64 bg-white border rounded shadow-lg z-10">

                    <form onSubmit={handleSubmit(onSubmit)} className="p-2 border-b">
                        <input
                            type="text"
                            placeholder="Workspace Name"
                            {...register("name", {required: "Workspace name is required"})}
                            className="w-full px-2 py-1 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mb-3">
                                {errors.name.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className=" w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 hover: cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Workspace"}
                        </button>
                    </form>

                    <ul className="max-h-48 overflow-auto">
                        {workspaces.map((workspace: IWorkspace) => (
                            <li key={workspace.id} className={`px-3 py-1`}>
                                <button
                                    type="button"
                                    className={`px-3 py-1 rounded w-full text-left cursor-pointer hover:bg-blue-100 flex items-center gap-2 text-gray-600`}
                                    onClick={() => handleSelectWorkspace(workspace.id)}
                                >
                                    {selectedWorkspace?.id === workspace.id ? (
                                        <Check className="w-4 h-4 "/>
                                    ) : (
                                        <span className="w-4 h-4"></span>
                                    )}
                                    {workspace.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default WorkspacesDropDown;