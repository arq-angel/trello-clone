import mongoose, {Document, Schema} from "mongoose";

export interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    text: string;
    task: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
    {
        text: {type: String, required: true},
        task: {type: Schema.Types.ObjectId, ref: 'Task', required: true},
        author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {
        timestamps: true
    }
);

const comment = mongoose.model<IComment>('comment', commentSchema);
export default comment;