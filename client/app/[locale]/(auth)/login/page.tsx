import { getI18n } from "@/components/locales/server";
import { GithubBtn } from "@/features/auth/login/githubBtn";
import { LoginForm } from "@/features/auth/login/loginForm";
import Link from "next/link";

export default async function LoginPage() {
    const t = await getI18n();
    return (
        <div className="min-h-full grid place-items-center">
            <div className="grid gap-10">
                <div className="text-center">
                    <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                        <span className="text-primary-100">
                            {t("auth.loginForm.title")}
                        </span>{" "}
                        {t("to")} {t("appName")}
                    </h3>
                    <p className="text-xl text-muted-foreground">
                        {t("auth.loginForm.subTitle")}
                    </p>
                </div>

                <div className="grid gap-4">
                    <LoginForm />
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                    <GithubBtn />
                    <div className="text-sm font-medium leading-none">
                        {t("auth.loginForm.createAccount")}{" "}
                        <Link href="/signup" className="underline">
                            {t("auth.loginForm.register")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
