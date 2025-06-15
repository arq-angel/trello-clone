import {useState, useEffect} from "react";
import {SquarePen} from "lucide-react";
import {useForm} from "react-hook-form";
import type {IBoard, IList} from "@/models";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {useAppDispatch} from "@/hooks.ts";
import {setSelectedBoard} from "@/features/boards/selectedBoard.slice.ts";
import {useListActions} from "@/hooks/useListActions.ts";

interface UpdateListModalProps {
    list: IList;
    board: IBoard;
    setOpen: (open: boolean) => void;
}

interface FormValues {
    name: string;
}

const UpdateListModal = ({list, board, setOpen}: UpdateListModalProps) => {
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
        reset({name: list.name});
    }, [list.name, reset]);

    const {updateList} = useListActions(setError);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        reset({name: list.name});
        setOpen(false);
        setIsOpen(false);
    };

    const onSubmit = async (data: FormValues) => {
        if (!list && !board) return;
        const {success} = await updateList(list.id, data.name.trim(), list.position);
        if (success) {
            closeModal();
            setOpen(false);
        }
    };

    return (
        <>
            <MenuItem icon={SquarePen}
                      label="Edit List"
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

export default UpdateListModal;