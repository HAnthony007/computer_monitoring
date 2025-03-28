import { Hero } from "@/components/ui/animated-hero";
import { Suspense } from "react";

export default async function Home() {
    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl lg:max-w-7xl min-h-full">
            <Suspense fallback={<div>Hello loading...</div>}>
                <Hero />
            </Suspense>
        </div>
    );
}
