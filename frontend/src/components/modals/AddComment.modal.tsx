import {Plus} from "lucide-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {useCommentActions} from "@/hooks/useCommentActions.ts";
import type {ITask} from "@/models";

interface FormValues {
    text: string;
}

interface AddCommentModalProps {
    task: ITask;
    isMenuModal: boolean;
    setOpen?: (open: boolean) => void;
    className?: string;
}

const AddCommentModal = ({
                             task,
                             isMenuModal = false,
                             setOpen = () => {
                                 return null;
                             },
                             className
                         }: AddCommentModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormValues>();

    const {createComment} = useCommentActions(setError);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        reset(); // Reset form state when closing
    };

    const onSubmit = async (data: FormValues) => {
        if (!task) return;
        const {success} = await createComment(data.text.trim(), task.id);
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
                    className={`px-3 py-1 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white rounded ${className}`}
                >
                    <div className="flex items-center gap-1">
                        <Plus/>
                        <span>Add Comment</span>
                    </div>
                </button>
            )}

            {isMenuModal && (<MenuItem icon={Plus}
                                       label="Add Comment"
                                       onClick={openModal}
                                       className={`text-blue-500 hover:bg-blue-100 w-full ${className}`}
                />
            )}

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Add New Comment</h2>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <textarea
                                placeholder="Enter your comment"
                                {...register("text", {required: "Comment is required"})}
                                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                            {errors.text && (
                                <p className="text-red-500 text-sm mb-3">
                                    {errors.text.message}
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

export default AddCommentModal;
