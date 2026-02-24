import moment from 'moment';
import mongoose from 'mongoose';

import { Action, type IAction } from '../infrastructure/database/models/action.model';
import { Admin, type IAdmin } from '../infrastructure/database/models/admin.model';
import { Role, type IRole } from '../infrastructure/database/models/role.model';

export const seedRepository = {
   async seed() {
      const actionsSeed: IAction[] = [
         {
            name: 'user.read',
            resource: 'user',
            operation: 'read',
            description: 'View all users',
         },
         {
            name: 'user.create',
            resource: 'user',
            operation: 'create',
            description: 'Create users',
         },
      ];

      const createdActions = await Action.insertMany(actionsSeed);

      const rolesSeed: IRole[] = [
         {
            name: 'Follow Up Team',
            description: 'Manage First Timer Feedback',
            actions: createdActions.map((action) => action._id),
            isActive: true,
         },
      ];

      const createdRoles = await Role.insertMany(rolesSeed);

      const adminSeed: IAdmin[] = [
         {
            _id: new mongoose.Types.ObjectId(),
            imageUrl:
               'https://scontent.fiba2-3.fna.fbcdn.net/v/t39.30808-1/315893900_5582548451861659_5433297113647616719_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=102&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeG2FiDuzAuaf0xq7Y7kLelrrHxjd-v45xOsfGN36_jnE-jm9LhIlrGs3m3k8UcIJknAt9tSdSSqs7Sc7jKUqY_M&_nc_ohc=05q5y3lVnqIQ7kNvwG5iFEM&_nc_oc=AdkFdwGkVZPpYgncBRqW_dZUqoeKg99MnaWdVryJP2ttT40JYZ2Z6MYfcdfWBn8J6A0&_nc_zt=24&_nc_ht=scontent.fiba2-3.fna&_nc_gid=EtxvWptK4xdM8pl5P6RQDg&oh=00_Afsag2ztrRTVsCRhylnt1xb4rzFrVHHeIsl03GKHHra5Zg&oe=6996AD5A',
            firstName: 'Chukwuma',
            lastName: 'Marcel',
            email: 'marcel.chukwuma00@gmail.com',
            password: '$2b$10$N9qo8uLOickgx2ZMRZo5i.eWZ7wY6r7n2p4mQeOeZq9yZ0eK7X6Pe',
            isActive: true,
            designation: 'Media HOD',
            createdAt: moment().toDate(),
            updatedAt: moment().toDate(),
            roles: createdRoles.map((role) => role._id),
         },
      ];

      const createdAdmins = await Admin.insertMany(adminSeed);

      return { createdActions, createdAdmins, createdRoles };
   },
};
