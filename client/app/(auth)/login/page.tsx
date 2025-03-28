import { Suspense } from "react";

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Hello loading...</div>}>
            <h1>Login</h1>;
        </Suspense>
    );
}
