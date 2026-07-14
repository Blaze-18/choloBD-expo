import { z } from 'zod';

export const createPostSchema = z.object({
  userTripPlanId: z.string().uuid().optional(),
  caption: z.string().min(1, 'Caption is required').max(2000, 'Caption must be 2000 characters or less'),
});

export const imageObjectSchema = z.object({
  url: z.string().url('Invalid image URL'),
  order: z.number().int().nonnegative().optional(),
  altText: z.string().max(500).optional(),
});

export const updatePostImagesSchema = z.object({
  images: z.array(imageObjectSchema).min(1, 'At least one image is required').max(5, 'Max 5 images allowed'),
});

export const tagUserSchema = z.object({
  taggedUserId: z.string().uuid('Invalid user id'),
});

export const tagResponseSchema = z.object({
  response: z.enum(['ACCEPTED', 'DECLINED']),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export type CreatePostForm = z.infer<typeof createPostSchema>;
export type UpdatePostImagesForm = z.infer<typeof updatePostImagesSchema>;
export type TagUserForm = z.infer<typeof tagUserSchema>;
export type TagResponseForm = z.infer<typeof tagResponseSchema>;
