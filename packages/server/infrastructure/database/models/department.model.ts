import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      hod: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
   },
   { timestamps: true }
);

export type IDepartment = mongoose.InferSchemaType<typeof departmentSchema>;
export const Department = mongoose.model<IDepartment>('Department', departmentSchema);
