import type { IUserCreate } from '../infrastructure/database/validators/user.validator';

import { serviceReportRepository } from '../repositories/service-report.repository';
import { userRepository } from '../repositories/user.repository';

export const userService = {
   async validateFollowUpPayload(body: IUserCreate) {
      if (body.isFirstTimer) {
         const [assignedTo, serviceReport] = await Promise.all([
            userRepository.getOneUserById(body.assignTo!),
            serviceReportRepository.getOneServiceReportById(body.serviceAttended!),
         ]);

         if (!assignedTo) {
            return { success: false, message: 'Invalid follow up contact provided.', followUpPayload: null };
         }

         if (!assignedTo.department) {
            return { success: false, message: 'You can only assign a member for followup to a worker. Please select a worker with a department.', followUpPayload: null };
         }

         if (!serviceReport) {
            return { success: false, message: 'Invalid service report provided.', followUpPayload: null };
         }

         return {
            success: true,
            message: 'Follow-up payload is valid.',
            followUpPayload: { assignedTo, serviceAttended: serviceReport },
         };
      }

      return { success: true, message: 'The user is not a first timer.', followUpPayload: null };
   },
};
