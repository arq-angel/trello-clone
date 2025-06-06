import {useEffect, useState} from "react";
import {useAppDispatch} from "../hooks";
import * as React from "react";
import {createTask, fetchTasksByListId} from "../features/tasks/task.thunks";

interface CreateTaskFormProps {
    listId: string;
}

const CreateTaskFormComponent = ({listId}: CreateTaskFormProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("Dummy decription");
    const [position, setPosition] = useState(1);
    const [dueDate, setDueDate] = useState("2025-05-30T14:30:00Z");
    const [priority, setPriority] = useState("low");

    useEffect(() => {
        setDescription("Demo description");
        setPosition(1);
        setDueDate("2025-05-30T14:30:00Z");
        setPriority("low");
    }, []);


    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        try {
            await dispatch(createTask({title, description,listId, position, dueDate, priority })).unwrap();
            setTitle("");
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
        <form onSubmit={handleSubmit} style={{marginTop: "1rem"}}>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="New List Name"
                required
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

export default CreateTaskFormComponent;