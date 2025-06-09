"use client";

import { Icons } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    registerFormSchemas,
    registerSchemaType,
} from "../schemas/signup-schema";
import { useRedirectIfAuthentificated } from "@/hooks/useRedirectIfAuthentificated";
import Loading from "@app/loading";

export const SignupForm = () => {
    const router = useRouter();
    const { isLoading } = useRedirectIfAuthentificated();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<registerSchemaType>({
        resolver: zodResolver(registerFormSchemas),
        mode: "onBlur",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: registerSchemaType) => {
        setIsSubmitting(true);

        toast.promise(
            async () => {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            },
            {
                loading: "Register in...",
                success: () => {
                    setIsSubmitting(false);
                    reset();
                    console.log(data);
                    router.push("/login");
                    return "Login successful!";
                },
                error: (result) => {
                    setIsSubmitting(false);
                    if (result.errors) {
                        return Object.values(result.errors).join(", ");
                    }
                    return result.errorMessage || "Failed register";
                },
            }
        );
    };

    if (isLoading) {
        return <Loading />;
    }
    return (
        <form className="grid gap-10" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div>
                    <label
                        htmlFor="Name"
                        className={
                            errors.name
                                ? "text-red-500 "
                                : "text-muted-foreground"
                        }
                    >
                        Pseudo
                    </label>
                    <Input
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                        placeholder="Your pseudo"
                    />
                    {errors.name && (
                        <div className="text-red-500 text-sm">
                            {errors.name.message}
                        </div>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className={
                            errors.email
                                ? "text-red-500 "
                                : "text-muted-foreground"
                        }
                    >
                        Email
                    </label>
                    <Input
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="code@level.com"
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
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className={
                            errors.confirmPassword
                                ? "text-red-500"
                                : "text-muted-foreground"
                        }
                    >
                        Confirm
                    </label>
                    <PasswordInput
                        {...register("confirmPassword")}
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                        <div className="text-red-500 text-sm">
                            {errors.confirmPassword.message}
                        </div>
                    )}
                </div>
            </div>
            <div className={"flex flex-col gap-4"}>
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
                            Sign Up
                        </Button>
                    )}
                </div>
                <div className="text-sm font-medium leading-none">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                        Log in
                    </Link>
                </div>
            </div>
        </form>
    );
};
