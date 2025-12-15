import * as z from "zod"

const UM_DOMAIN = '@umindanao.edu.ph'

export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address').refine((val) => val.toLowerCase().endsWith(UM_DOMAIN), {
    message: `Email must be a ${UM_DOMAIN} address`,
  }),
  password: z.string().min(1, 'Password is required'),
})
