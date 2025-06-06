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
        <form onSubmit={handleSubmit} style={{marginTop: "1rem"}}>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="New List Name"
                required
            />
            <button type="submit" disabled={isSubmitting}>Add List</button>
        </form>
    );
};

export default CreateListForm;