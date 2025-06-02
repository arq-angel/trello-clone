import {useState} from "react";

interface CreateWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
}

const CreateWorkspaceModal = ({isOpen, onClose, onSubmit}: CreateWorkspaceModalProps) => {
    const [name, setName] = useState("");

    const handleSubmit = () => {
        if (name?.trim()) {
            onSubmit(name.trim());
            setName("");
            onClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                width: "300px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.5)"
            }}>
                <h3>Create Workspace</h3>
                <input
                    type="text"
                    placeholder="Enter workspace name:"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{width: "100%", padding: "0.5rem", marginBottom: "1rem"}}
                />
                <div style={{display: "flex", justifyContent: "flex-end", gap: "0.5rem"}}>
                    <button onClick={onClose} style={{padding: "0.5rem 1rem"}}>Cancel</button>
                    <button onClick={handleSubmit} style={{padding: "0.5rem 1rem"}}>Create</button>
                </div>
            </div>
            <h1>CreateWorkspaceModal Component</h1>
        </div>
    );
};

export default CreateWorkspaceModal;