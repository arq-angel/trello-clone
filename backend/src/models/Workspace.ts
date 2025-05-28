import mongoose, {Document, Schema} from 'mongoose';

export interface IWorkspace extends Document {
    _id: mongoose.Types.ObjectId,
    name: string,
    owner: mongoose.Types.ObjectId,
    members: mongoose.Types.ObjectId[]
}

const workspaceSchema: Schema = new Schema<IWorkspace>(
    {
        name: {type: String, required: true},
        owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        members: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    },
    {
        timestamps: true,
    }
);

const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);
export default Workspace;