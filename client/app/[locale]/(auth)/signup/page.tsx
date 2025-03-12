import { getI18n } from "@/components/locales/server";
import { SignupForm } from "@/features/auth/signup/signupForm";

export default async function SignupPage() {
    const t = await getI18n();
    return (
        <div className="min-h-full grid place-items-center">
            <div className="grid gap-10">
                <div className="text-center">
                    <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                        <span className="text-primary-100">
                            {t("auth.registerForm.title")}
                        </span>{" "}
                        {t("to")} {t("appName")}
                    </h3>
                    <p className="text-xl text-muted-foreground">
                        {t("auth.registerForm.subTitle")}
                    </p>
                </div>

                <SignupForm />
            </div>
        </div>
    );
}
