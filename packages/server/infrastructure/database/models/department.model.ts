import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

const departmentSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      hod: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
   },
   { timestamps: true }
);

departmentSchema.virtual('totalMembership', {
   ref: 'User',
   localField: '_id',
   foreignField: 'department',
   count: true,
});

departmentSchema.plugin(mongooseLeanVirtuals);

export type IDepartment = mongoose.InferSchemaType<typeof departmentSchema>;
export const Department = mongoose.model<IDepartment>('Department', departmentSchema);
