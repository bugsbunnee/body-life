import bcrypt from 'bcrypt';
import crypto from 'crypto';

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { lib } from '../utils/lib';
import { adminRepository } from '../repositories/admin.repository';
import { userRepository } from '../repositories/user.repository';

export const authController = {
   async adminLogin(req: Request, res: Response) {
      const admin = await adminRepository.getActiveAdminByEmail(req.body.email);

      if (!admin || !admin.password) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(req.body.password, admin.password);

      if (!isValid) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid credentials' });
      }

      const response = admin.generateAuthToken();
      await admin.sendWelcomeEmail();

      res.json(response);
   },

   async asignUserAsAdmin(req: Request, res: Response) {
      let user = await userRepository.getOneUserById(req.body.user);

      if (!user) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The user with the given email does not exist!' });
      }

      if (user.isAdmin) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The user is already an admin.' });
      }

      user = await adminRepository.assignUserAsAdmin(user._id);

      if (!user) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The user with the given email does not exist!' });
      }

      const response = user.generateAuthToken();
      await user.sendPasswordSetupEmail();

      res.json(response);
   },

   async resetPassword(req: Request, res: Response): Promise<any> {
      let token = crypto.createHash('sha256').update(req.body.token).digest('hex');
      let admin = await adminRepository.getAdminForPasswordReset(token);

      if (!admin) {
         return res.status(StatusCodes.NOT_FOUND).json({ message: 'The token is invalid or has expired!' });
      }

      admin.password = await lib.hashPassword(req.body.password);
      admin.passwordResetToken = null;
      admin.passwordResetTokenExpiryDate = null;

      admin = await admin.save();

      res.json({ message: 'Password updated successfully! Please login with the new credentials.' });
   },
};
