import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface Game extends Document {
    creator: string,
    secondPlayer: string,
    winner: string,
    creationDate: Date,
};

const GameSchema : Schema<Game> = new Schema({
    creator: {
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true,
    },
    secondPlayer: {
        ref: 'User',
        type: Schema.Types.ObjectId,
    },
    winner: {
        ref: 'User',
        type: Schema.Types.ObjectId,
    },
    creationDate: {
        type: Date,
        default: Date.now(),
    },
})

exports.module = mongoose.model('Game', GameSchema);