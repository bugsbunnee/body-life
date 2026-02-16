import z from 'zod';

export const LoginSchema = z.object({
   email: z.email(),
   password: z.string().min(1, { error: 'Password is required' }),
});

export const PasswordSchema = z.object({
   token: z.string(),
   password: z.string().min(1, { error: 'Password is required' }),
   confirmPassword: z.string().min(1, { error: 'Confirm password is required' }),
});

export type ILogin = z.infer<typeof LoginSchema>;
export type IPassword = z.infer<typeof PasswordSchema>;
