import type mongoose from 'mongoose';
import { Department } from '../infrastructure/database/models/department.model';

export const departmentRepository = {
   async getOneDepartment(departmentId: mongoose.Types.ObjectId) {
      return Department.findById(departmentId).lean().exec();
   },
};
