import {useState} from "react";
import {useAppDispatch} from "../hooks";
import * as React from "react";
import {createList, fetchListsByBoardId} from "../features/lists/list.thunks";

interface CreateListFormProps {
    boardId: string;
}

const CreateListFormComponent = ({boardId}: CreateListFormProps) => {
    const [name, setName] = useState("");
    const [position, setPosition] = useState(1);

    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        try {
            await dispatch(createList({name, boardId, position})).unwrap();
            setName("");
        } catch (error) {
            alert(error);
        }

        try {
            dispatch(fetchListsByBoardId({boardId})).unwrap();
        } catch (error) {
            alert(error);
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
            <button type="submit">Add List</button>
        </form>
    );
};

export default CreateListFormComponent;