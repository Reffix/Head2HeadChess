import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface Invitation extends Document {
    host: string,
    invitee: string,
    createDAte: Date,
}

const InvitationSchema : Schema<Invitation> = new Schema({
    host: {
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true,
    },
    invitee: {
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now(),
    }
});

const invitationModel = mongoose.model('Invitation', InvitationSchema);
export default invitationModel;