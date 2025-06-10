import {useState} from "react";
import {useAppDispatch} from "../hooks";
import * as React from "react";
import {createBoard} from "../features/boards/board.thunks";

interface CreateListFormProps {
    workspaceId: string;
}

const CreateListForm = ({workspaceId}: CreateListFormProps) => {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            await dispatch(createBoard({name, workspaceId})).unwrap();
            setName("");
        } catch (error) {
            alert(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New Board Name"
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? "Adding..." : "Add Board"}
            </button>
        </form>
    );
};

export default CreateListForm;