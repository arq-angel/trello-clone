import {useState, useEffect} from "react";
import {SquarePen} from "lucide-react";
import {useForm} from "react-hook-form";
import {useWorkspaceActions} from "@/hooks/useWorkspaceActions.ts";
import type {IWorkspace} from "@/models";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {useAppDispatch} from "@/hooks.ts";
import {setSelectedWorkspace} from "@/features/workspaces/selectedWorkspace.slice.ts";

interface UpdateWorkspaceModalProps {
    workspace: IWorkspace;
    setOpen: (open: boolean) => void;
}

interface FormValues {
    name: string;
}

const UpdateWorkspaceModal = ({workspace, setOpen}: UpdateWorkspaceModalProps) => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormValues>();

    useEffect(() => {
        reset({name: workspace.name});
    }, [workspace.name, reset]);

    const {updateWorkspace} = useWorkspaceActions(setError);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        reset({name: workspace.name});
        setOpen(false);
        setIsOpen(false);
    };

    const onSubmit = async (data: FormValues) => {
        if (!workspace) return;
        const {success, data: updatedWorkspace} = await updateWorkspace(workspace.id, data.name.trim());
        if (success) {
            closeModal();
            setOpen(false);
            dispatch(setSelectedWorkspace(updatedWorkspace));
        }
    };

    return (
        <>
            <MenuItem icon={SquarePen}
                      label="Edit Workspace"
                      onClick={openModal}
                      className="text-blue-500 hover:bg-blue-100 w-full"
            />

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Update Workspace</h2>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                type="text"
                                placeholder="Workspace Name"
                                {...register("name", {required: "Workspace name is required"})}
                                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mb-3">
                                    {errors.name.message}
                                </p>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border rounded hover:bg-gray-100 hover:cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50 hover:cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateWorkspaceModal;