import mongoose, {Document, Schema} from "mongoose";

export interface IList extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    board: mongoose.Types.ObjectId;
    position: number;
}

const ListSchema = new Schema<IList>(
    {
        name: {type: String, required: true},
        board: {type: Schema.Types.ObjectId, ref: "Board", required: true},
        position: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
);

const List = mongoose.model<IList>("List", ListSchema);
export default List;