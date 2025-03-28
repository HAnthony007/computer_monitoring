import { Suspense } from "react";

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Hello loading...</div>}>
            <h1>Signup</h1>;
        </Suspense>
    );
}
