import {useState} from "react";
import {useAppDispatch} from "../hooks";
import * as React from "react";
import {createComment, fetchCommentsByTaskId} from "../features/comments/comment.thunks.ts";

interface CreateCommentFormProps {
    taskId: string;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateCommentFormComponent = ({taskId, setModalOpen}: CreateCommentFormProps) => {
    const [text, setText] = useState("");

    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text.trim()) return;

        try {
            await dispatch(createComment({taskId, text})).unwrap();
            setText("");
            setModalOpen(false);
        } catch (error) {
            alert(error);
        }

        try {
            dispatch(fetchCommentsByTaskId({taskId})).unwrap();
        } catch (error) {
            alert(error);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-3 bg-white p-4 rounded-lg shadow"
        >
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment"
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-blue-600 transition duration-200"
            >
                Add Comment
            </button>
        </form>
    );
};

export default CreateCommentFormComponent;