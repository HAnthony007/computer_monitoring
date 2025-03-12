"use client";
import { Icons } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { githubAction } from "./login.action";

export const GithubBtn = () => {
    const [, action, pending] = useActionState(githubAction, undefined);
    return (
        <form action={action}>
            {pending ? (
                <Button disabled variant="outline" className="w-full text-sm">
                    <Icons.spinner className="animate-spin" />
                    Login with GitHub
                </Button>
            ) : (
                <Button variant="outline" className="w-full text-sm">
                    <Icons.gitHub />
                    Login with GitHub
                </Button>
            )}
        </form>
    );
};
