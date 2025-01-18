import * as z from "zod";
export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
})


export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  name: z.string().min(6, {
    message: "Name must be at least 6 characters",
  }).max(50, {
    message: "Name must be at most 50 characters",
  }),
})