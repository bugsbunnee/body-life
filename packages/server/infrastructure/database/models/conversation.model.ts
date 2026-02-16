import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
   {
      conversationId: { type: String, unique: true, required: true },
      lastResponseId: { type: String, required: false, default: undefined },
   },
   { timestamps: true }
);

export type IConversation = mongoose.InferSchemaType<typeof conversationSchema>;
export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
