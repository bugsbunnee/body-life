import type mongoose from 'mongoose';

export type ModelWithId = {
   _id: mongoose.Types.ObjectId;
};
