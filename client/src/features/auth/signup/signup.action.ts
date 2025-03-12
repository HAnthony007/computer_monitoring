import { convertZodErrors } from "@/lib/utils";
import { registerFormSchemas, registerSchemaType } from "./signupSchema";

export async function signupAction(formData: registerSchemaType) {
    const validateFields = registerFormSchemas.safeParse(formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!validateFields.success) {
        const errors = convertZodErrors(validateFields.error);
        return {
            errors: errors,
            message: "Invalid form data",
        };
    }
    return {
        successMessage: "Signed up successfully!",
    };
}
