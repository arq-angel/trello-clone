import {Plus} from "lucide-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {useListActions} from "@/hooks/useListActions.ts";
import type {IBoard} from "@/models";
import {useSelector} from "react-redux";
import type {RootState} from "@/app/store.ts";

interface FormValues {
    name: string;
}

interface AddListModalProps {
    board: IBoard;
    isMenuModal: boolean;
}

const AddListModal = ({board, isMenuModal = false}: AddListModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormValues>();

    const {createList} = useListActions(setError);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        reset(); // Reset form state when closing
    };

    const {listsByBoard} = useSelector((state: RootState) => state.lists);

    const onSubmit = async (data: FormValues) => {
        if (!board) return;

        // Get the existing lists for the current board
        const currentLists = listsByBoard[board.id] || [];

        // Determine the next position (e.g., append to end)
        const nextPosition: number = (currentLists.length > 0 ? currentLists.length + 1 : 1);

        const {success} = await createList(data.name.trim(), board.id, nextPosition);

        if (success) {
            closeModal();
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
                        <span>Create List</span>
                    </div>
                </button>
            )}

            {isMenuModal && (<MenuItem icon={Plus}
                                       label="Create List"
                                       onClick={openModal}
                                       className="text-blue-500 hover:bg-blue-100 w-full"
                />
            )}

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Create New List</h2>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                type="text"
                                placeholder="List Name"
                                {...register("name", {required: "List name is required"})}
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

export default AddListModal;
