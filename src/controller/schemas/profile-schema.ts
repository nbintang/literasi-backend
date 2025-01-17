import z from "zod";

export const profileSchema = z.object({
  fullname: z
    .string()
    .min(6, {
      message: "Name must be at least 6 characters",
    })
    .max(100, {
      message: "Name must be at most 50 characters",
    }),
  bio: z
    .string()
    .min(6, {
      message: "Name must be at least 6 characters",
    })
    .max(500, {
      message: "Name must be at most 50 characters",
    }),
});
