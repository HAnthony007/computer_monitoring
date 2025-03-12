import { convertZodErrors } from "@/lib/utils";
import { loginFormSchemas, loginSchemaType } from "./loginSchema";

export async function loginAction(formData: loginSchemaType) {
    const validatedFields = loginFormSchemas.safeParse(formData);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (!validatedFields.success) {
        const errors = convertZodErrors(validatedFields.error);
        return {
            errors,
            errorMessage: "Invalid form data",
        };
    }

    return {
        successMessage: "Logged in successfully!",
    };
}

export async function githubAction() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
}
