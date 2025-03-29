import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./components/login-form";

export const Login = () => {
    return (
        <div className="min-h-full px-6 grid place-items-center">
            <div className="grid gap-10">
                <div className="text-center">
                    <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                        <span className="text-primary-100">Log in</span> to
                        System Monitoring
                    </h3>
                    <p className="text-xl text-muted-foreground">
                        Real-time Computer System Monitoring and Management
                    </p>
                </div>

                <div className="grid gap-4">
                    <Suspense fallback={"Loading..."}>
                        <LoginForm />
                    </Suspense>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                    {/* <Suspense fallback={"Loading ..."}>
                        <GithubBtn />
                    </Suspense> */}
                    <div className="text-sm font-medium leading-none">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            prefetch={true}
                            className="underline"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
