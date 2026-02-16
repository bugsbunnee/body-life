import bcrypt from 'bcrypt';
import crypto from 'crypto';

import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { adminRepository } from '../repositories/admin.repository';
import { lib } from '../utils/lib';

export const authController = {
   async adminLogin(req: Request, res: Response) {
      const admin = await adminRepository.getActiveAdminByEmail(req.body.email);

      if (!admin) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(req.body.password, admin.password);

      if (!isValid) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid credentials' });
      }

      if (!admin.isActive) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The given account is inactive. Kindly contact admin.' });
      }

      const response = admin.generateAuthToken();
      await admin.sendWelcomeEmail();

      res.json(response);
   },

   async createAdmin(req: Request, res: Response) {
      let admin = await adminRepository.getActiveAdminByEmail(req.body.email);

      if (admin) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'An admin with the given email already exists' });
      }

      const result = await adminRepository.validateRoles(req.body.roles);

      if (!result.success) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'At least one invalid role provided!' });
      }

      admin = await adminRepository.createAdminAccount({
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         email: req.body.email,
         imageUrl: req.body.imageUrl,
         designation: req.body.designation,
         roles: result.matchedRoles.map((role) => role._id),
      });

      const response = admin.generateAuthToken();
      await admin.sendPasswordSetupEmail();

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
