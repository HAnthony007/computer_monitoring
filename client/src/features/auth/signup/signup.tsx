import { Suspense } from "react";
import { SignupForm } from "./components/signup-form";

export default async function Signup() {
    return (
        <div className="min-h-full px-6 grid place-items-center">
            <div className="grid gap-10">
                <div className="text-center">
                    <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                        <span className="text-primary-100">Join</span> System
                        Monitoring
                    </h3>
                    <p className="text-xl text-muted-foreground">
                        Real-time Computer System Monitoring and Management
                    </p>
                </div>
                <Suspense fallback="Loading ...">
                    <SignupForm />
                </Suspense>
            </div>
        </div>
    );
}
