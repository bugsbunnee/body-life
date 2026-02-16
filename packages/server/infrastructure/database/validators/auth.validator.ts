import z from 'zod';
import { lib } from '../../../utils/lib';

export const AuthSchema = z.object({
   email: z.email(),
   password: z.string(),
});

export const AdminCreateSchema = z.object({
   imageUrl: z.url(),
   firstName: z.string().min(1, { error: 'First Name is required' }),
   lastName: z.string().min(1, { error: 'Last Name is required' }),
   email: z.email(),
   designation: z.string().min(1, { error: 'Designation is required!' }),
   roles: z
      .array(z.string())
      .min(1)
      .refine((roles) => roles.every((role) => lib.getObjectIdIsValid(role)))
      .transform((roles) => roles.map((role) => lib.parseObjectId(role))),
});

export const AdminPasswordSchema = z
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

export type IAdminCreate = z.infer<typeof AdminCreateSchema>;
export type IAuth = z.infer<typeof AuthSchema>;
