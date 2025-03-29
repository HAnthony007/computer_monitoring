"use client";

import { Icons } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginFormSchemas, loginSchemaType } from "../schemas/login-schema";
export const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<loginSchemaType>({
        resolver: zodResolver(loginFormSchemas),
        mode: "onBlur",
    });
    const onSubmit = (data: loginSchemaType) => {
        setIsSubmitting(true);
        toast.promise(
            async () => {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            },
            {
                loading: "Logging in...",
                success: () => {
                    reset();
                    console.log(data);
                    setIsSubmitting(false);
                    return "Login successful!";
                },
                error: () => {
                    setIsSubmitting(false);
                    return "Login failed. Please try again.";
                },
            }
        );
    };
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
                    <Input
                        type="password"
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
