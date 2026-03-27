import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
