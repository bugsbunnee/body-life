import mongoose from 'mongoose';
import type { ModelWithId } from './base.model';

const summarySchema = new mongoose.Schema({
   content: {
      type: String,
      required: true,
   },
   transcript: {
      type: String,
      required: true,
   },
   generatedAt: {
      type: Date,
      default: Date.now,
   },
   expiresAt: {
      type: Date,
      required: true,
   },
});

const messageSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      date: { type: Date, required: true, default: Date.now },
      videoUrl: { type: String, required: true },
      preacher: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
      summary: { type: summarySchema, required: false, default: null },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

export type IMessage = mongoose.InferSchemaType<typeof messageSchema>;
export type IMessageWithId = IMessage & ModelWithId;

export const Message = mongoose.model<IMessage>('Message', messageSchema);
