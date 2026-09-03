const { z }= require("zod");

const createUserSchema = z.object({
    name: z
        .string()
        .min(3, "Name must contain at least 3 characters")
        .max(50),

    email: z
        .string()
        .email("Invalid email address"),

    age: z
        .number()
        .min(18, "Age must be at least 18"),

});

module.exports= createUserSchema;