import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    id: string;
    email: string;
    password: string;
    role: boolean;
}

const userSchema: Schema = new Schema<IUser>({
    id: { 
        type: String, 
        required: true 
    },
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
