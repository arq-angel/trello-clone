import mongoose, {Document, Schema} from "mongoose";

export interface ITask extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    list: mongoose.Types.ObjectId;
    position: number,
    dueDate: Date;
    priority: "low" | "medium" | "high";
}

const taskSchema = new Schema<ITask>(
    {
        title: {type: String, required: true},
        description: {type: String},
        list: {type: Schema.Types.ObjectId, ref: 'List', required: true},
        position: {type: Number, required: true},
        dueDate: {type: Date},
        priority: {type: String, enum: ['low', 'medium', 'high']},
    },
    {
        timestamps: true,
    }
)

const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;