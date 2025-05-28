import mongoose, {Document, Schema} from "mongoose";

export interface IBoard extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    owner: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    workspace: mongoose.Types.ObjectId;
}

const boardSchema: Schema = new Schema<IBoard>(
    {
        name: {type: String, required: true},
        owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
        members: [{type: Schema.Types.ObjectId, ref: "User"}],
        workspace: {type: Schema.Types.ObjectId, ref: "Workspace", required: true},
    },
    {
        timestamps: true,
    }
);

const Board = mongoose.model<IBoard>("Board", boardSchema);
export default Board;