"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="grid min-h-full place-content-center bg-white px-4">
            <div className="text-center">
                <h1 className="text-9xl font-black text-gray-200">404</h1>

                <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Uh-oh!
                </p>

                <p className="mt-4 text-gray-500">
                    We can&apos;t find that page.
                </p>

                <Button
                    onClick={() => router.back()}
                    className="mt-6 inline-block rounded-sm px-5 text-sm font-medium focus:ring-3 focus:outline-hidden"
                >
                    Go Back
                </Button>
            </div>
        </div>
    );
}
