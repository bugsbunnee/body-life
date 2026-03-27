import z from 'zod';
import { lib } from '../../../utils/lib';

export const AuthSchema = z.object({
   email: z.email(),
   password: z.string(),
});

export const AdminAssignSchema = z.object({
   user: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value)),
});

export const AdminForgotPasswordSchema = z.object({
   email: z.email(),
});

export const AdminResetPasswordSchema = z
   .object({
      token: z.string().min(1, { error: 'Token is required' }),
      password: z
         .string()
         .min(8, { error: 'New password must be at least 8 characters' })
         .max(100, 'Password is too long')
         .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
         .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
         .regex(/[0-9]/, 'Password must contain at least one number')
         .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),
      confirmPassword: z.string(),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
   });

export type IAdminCreate = z.infer<typeof AdminAssignSchema>;
export type IAuth = z.infer<typeof AuthSchema>;
