'use client'

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "shadcn/ui"; // Assuming cn is a utility for merging class names

const Navbar: FC = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link href="/" className="text-gray-800 hover:text-gray-600">
                        Our Site
                    </Link>
                </div>
                <div>
                    {session ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                Welcome, {user.username}
                            </span>
                            <Button
                                onClick={() => signOut()}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
