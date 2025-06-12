import {Plus} from "lucide-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import type {IList} from "@/models";
import {useTaskActions} from "@/hooks/useTaskActions.ts";

interface FormValues {
    title: string;
}

interface AddTaskModalProps {
    list: IList;
    isMenuModal: boolean;
    setOpen: (open: boolean) => void;
}

const AddTaskModal = ({list, isMenuModal = false, setOpen}: AddTaskModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormValues>();

    const {createTask} = useTaskActions(setError);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        reset(); // Reset form state when closing
    };

    const onSubmit = async (data: FormValues) => {
        if (!list) return;
        const {success} = await createTask(data.title.trim(), "demo description", list.id, 1, "2025-12-29", "low");
        if (success) {
            closeModal();
            setOpen(false);
        }
    };

    return (
        <>
            {!isMenuModal && (
                <button
                    onClick={openModal}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white rounded"
                >
                    <div className="flex items-center gap-1">
                        <Plus/>
                        <span>Create Task</span>
                    </div>
                </button>
            )}

            {isMenuModal && (<MenuItem icon={Plus}
                                       label="Create Task"
                                       onClick={openModal}
                                       className="text-blue-500 hover:bg-blue-100 w-full"
                />
            )}

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

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
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white rounded disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddTaskModal;
