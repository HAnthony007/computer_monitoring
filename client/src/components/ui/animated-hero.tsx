"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function Hero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["efficient", "secure", "real-time", "powerful", "intelligent"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="flex gap-8 py-16 lg:py-36 items-center justify-center flex-col">
            <div>
                <Button variant="secondary" size="sm" className="gap-4">
                    Learn More About Monitoring{" "}
                    <MoveRight className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex gap-4 flex-col">
                <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
                    <span className="text-spektr-cyan-50">
                        Your system is now
                    </span>
                    <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                        &nbsp;
                        {titles.map((title, index) => (
                            <motion.span
                                key={index}
                                className="absolute font-semibold"
                                initial={{ opacity: 0, y: "-100" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 50,
                                }}
                                animate={
                                    titleNumber === index
                                        ? {
                                              y: 0,
                                              opacity: 1,
                                          }
                                        : {
                                              y:
                                                  titleNumber > index
                                                      ? -150
                                                      : 150,
                                              opacity: 0,
                                          }
                                }
                            >
                                {title}
                            </motion.span>
                        ))}
                    </span>
                </h1>

                <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                    Monitor and analyze your computer system’s performance in
                    real-time. Ensure security, optimize resource usage, and
                    prevent failures with our intelligent monitoring solution.
                </p>
            </div>
            <div className="flex flex-row gap-3">
                {/* <Button size="lg" className="gap-4" variant="outline"> */}
                {/* Login <PhoneCall className="w-4 h-4" /> */}
                {/* Login <LogIn className="w-4 h-4" /> */}
                {/* </Button> */}
                <Link href="/login">
                    <Button size="lg" className="gap-4 cursor-pointer">
                        Sign up here <MoveRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export { Hero };
