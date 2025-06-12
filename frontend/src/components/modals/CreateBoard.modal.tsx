import {Plus} from "lucide-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import type {IWorkspace} from "@/models";
import {useBoardActions} from "@/hooks/useBoardsActions.ts";
import {useAppDispatch} from "@/hooks.ts";
import {setSelectedBoard} from "@/features/boards/selectedBoard.slice.ts";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";

interface FormValues {
    name: string;
}

interface CreateBoardModalProps {
    workspace: IWorkspace;
    isMenuModal?: boolean;
}

const CreateBoardModal = ({workspace, isMenuModal = false}: CreateBoardModalProps) => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<FormValues>();

    const {createBoard} = useBoardActions(setError);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        reset(); // Reset form state when closing
    };

    const onSubmit = async (data: FormValues) => {
        if (!workspace) return;
        const {success, data: newBoard} = await createBoard(data.name.trim(), workspace.id);
        if (success) {
            closeModal();
            dispatch(setSelectedBoard(newBoard));
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
                        <span>Create Board</span>
                    </div>
                </button>
            )}

            {isMenuModal && (<MenuItem icon={Plus}
                                       label="Create Board"
                                       onClick={openModal}
                                       className="text-blue-500 hover:bg-blue-100 w-full"
                />
            )}

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Create New Board</h2>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                type="text"
                                placeholder="Board Name"
                                {...register("name", {required: "Board name is required"})}
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

export default CreateBoardModal;
