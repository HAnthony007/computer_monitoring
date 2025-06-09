"use client";

import { Icons } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginFormSchemas, loginSchemaType } from "../schemas/login-schema";
import { useRedirectIfAuthentificated } from "@/hooks/useRedirectIfAuthentificated";
import Loading from "@app/loading";

export const LoginForm = () => {
    const { isLoading } = useRedirectIfAuthentificated();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<loginSchemaType>({
        resolver: zodResolver(loginFormSchemas),
        mode: "onBlur",
    });

    const login = useAuthStore((state) => state.login);

    const onSubmit = async (data: loginSchemaType) => {
        setIsSubmitting(true);
        try {
            await login(data.email, data.password);
            reset();
            router.push("/dashboard");
            toast.success("Login successful!");
        } catch (error: any) {
            if (error.status === 404) {
                setError("email", {
                    type: "manual",
                    message: "User not found",
                });
            } else if (error.status === 401) {
                setError("password", {
                    type: "manual",
                    message: "Invalid password",
                });
            }
            toast.error("Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <form className="grid gap-10" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div>
                    <label
                        htmlFor="email"
                        className={
                            errors.email
                                ? "text-red-500"
                                : "text-muted-foreground"
                        }
                    >
                        Email
                    </label>
                    <Input
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="email@gmail.com"
                    />
                    {errors.email && (
                        <div className="text-red-500 text-sm">
                            {errors.email.message}
                        </div>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className={
                            errors.password
                                ? "text-red-500"
                                : "text-muted-foreground"
                        }
                    >
                        Password
                    </label>
                    <PasswordInput
                        {...register("password")}
                        placeholder="Your password"
                    />
                    {errors.password && (
                        <div className="text-red-500 text-sm">
                            {errors.password.message}
                        </div>
                    )}
                    <div className="text-right text-sm text-muted-foreground underline">
                        <Link href="#">Forgot password?</Link>
                    </div>
                </div>
            </div>
            <div>
                {isSubmitting ? (
                    <Button
                        size={"lg"}
                        disabled
                        className="w-full text-sm font-semibold"
                    >
                        <Icons.spinner className="animate-spin" />
                        Please wait
                    </Button>
                ) : (
                    <Button
                        size={"lg"}
                        type="submit"
                        className="w-full text-sm font-semibold"
                    >
                        Log in
                    </Button>
                )}
            </div>
        </form>
    );
};
