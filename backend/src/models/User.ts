import mongoose, {Document, Schema, Types} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["admin", "user"], default: "user"},
});

// Password hashing
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;