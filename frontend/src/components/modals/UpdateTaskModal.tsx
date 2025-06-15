import {useState, useEffect} from "react";
import {SquarePen} from "lucide-react";
import {useForm} from "react-hook-form";
import type {IList, ITask} from "@/models";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {useTaskActions} from "@/hooks/useTaskActions.ts";

interface FormValues {
    title: string;
}

interface UpdateTaskModalProps {
    task: ITask;
    list: IList;
    setOpen: (open: boolean) => void;
}

const UpdateTaskModal = ({task, list, setOpen}: UpdateTaskModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormValues>();

    useEffect(() => {
        reset({title: task.title});
    }, [task.title, reset]);

    const {updateTask} = useTaskActions(setError);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        reset({name: task.title});
        setOpen(false);
        setIsOpen(false);
    };

    const onSubmit = async (data: FormValues) => {
        if (!task && !list) return;
        const {success} = await updateTask(task.id, data.title.trim(), "demo description", list.id, list.position, "2025-12-29", "low");
        if (success) {
            closeModal();
            setOpen(false);
        }
    };

    return (
        <>
            <MenuItem icon={SquarePen}
                      label="Edit Board"
                      onClick={openModal}
                      className="text-blue-500 hover:bg-blue-100 w-full"
            />

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Update Task</h2>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                type="text"
                                placeholder="Task Title"
                                {...register("title", {required: "Task title is required"})}
                                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mb-3">
                                    {errors.title.message}
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

export default UpdateTaskModal;