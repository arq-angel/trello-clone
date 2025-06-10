import {useEffect, useState} from "react";
import {useAppDispatch} from "../hooks";
import * as React from "react";
import {createTask, fetchTasksByListId} from "../features/tasks/task.thunks";

interface CreateTaskFormProps {
    listId: string;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTaskFormComponent = ({listId, setModalOpen}: CreateTaskFormProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("Dummy decription");
    const [position, setPosition] = useState(1);
    const [dueDate, setDueDate] = useState("2025-05-30T14:30:00Z");
    const [priority, setPriority] = useState("low");

    useEffect(() => {
        setDescription("Demo description");
        setPosition(1);
        setDueDate("2025-05-30T14:30:00Z");
        setPriority("medium");
    }, []);


    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        try {
            await dispatch(createTask({title, description,listId, position, dueDate, priority })).unwrap();
            setTitle("");
            setModalOpen(false);
        } catch (error) {
            alert(error);
        }

        try {
            dispatch(fetchTasksByListId({listId})).unwrap();
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New Task Title"
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-blue-600 transition duration-200"
            >
                Add Task
            </button>
        </form>
    );
};

export default CreateTaskFormComponent;