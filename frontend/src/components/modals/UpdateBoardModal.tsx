import {useState, useEffect} from "react";
import {SquarePen} from "lucide-react";
import {useForm} from "react-hook-form";
import type {IBoard, IWorkspace} from "@/models";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {useBoardActions} from "@/hooks/useBoardsActions.ts";
import {useAppDispatch} from "@/hooks.ts";
import {setSelectedBoard} from "@/features/boards/selectedBoard.slice.ts";

interface UpdateBoardModalProps {
    board: IBoard;
    workspace: IWorkspace;
    setOpen: (open: boolean) => void;
}

interface FormValues {
    name: string;
}

const UpdateBoardModal = ({board, workspace, setOpen}: UpdateBoardModalProps) => {
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
        reset({ name: board.name });
    }, [board.name, reset]);

    const {updateBoard} = useBoardActions(setError);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        reset({name: board.name});
        setOpen(false);
        setIsOpen(false);
    };

    const onSubmit = async (data: FormValues) => {
        if (!board && !workspace) return;
        const {success, data: updatedBoard} = await updateBoard(board.id, data.name.trim(), workspace.id);
        if (success) {
            closeModal();
            setOpen(false);
            dispatch(setSelectedBoard(updatedBoard));
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
                        <h2 className="text-xl font-semibold mb-4">Update Board</h2>

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

export default UpdateBoardModal;