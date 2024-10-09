import mongoose, { Document, Schema } from 'mongoose';

interface ITimer extends Document {
    user_id: string;
    time: number;
}

const timerSchema: Schema = new Schema<ITimer>({
    user_id: {
        type: String,
    },
    time: {
        type: Number,
        required: true,
    },
});

const TimerModel = mongoose.model<ITimer>('Timer', timerSchema);

export default TimerModel;
