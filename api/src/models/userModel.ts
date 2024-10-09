import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    role: boolean;
    _id: string
}

const userSchema: Schema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Boolean,
        default: true,
    },
});

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
