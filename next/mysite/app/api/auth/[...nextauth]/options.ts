import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any, req): Promise<any> {
                const { email, password } = credentials;

                console.log(email);

                if (!email || !password) {
                    throw new Error("Please provide all required credentials.");
                }

                await dbConnect();

                try {
                    const user = await User.findOne({ email }).select('+password');

                    console.log(user)

                    if (!user) {
                        throw new Error("User not found. Please sign up first.");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your email address before logging in.");
                    }

                    // Check if user.password is defined before comparing
                    if (!user.password) {
                        throw new Error("Password is not set. Please reset your password.");
                    }

                    const isPasswordCorrect = await bcrypt.compare(password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid username or password.");
                    }

                    // If all checks pass, return the user object
                    return user;
                } catch (err) {
                    // Log the actual error internally for debugging
                    console.error("Authorization error:", err);
                    // Return a generic error message to the client
                    throw new Error("An error occurred while trying to log in. Please try again.");
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider === "credentials") return true;

            if (account?.provider === "google") {
                try {
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        await User.create({
                            email: user.email,
                            name: user.name,
                            googleId: account.id,
                            image: user.image,
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error during Google sign-in:", error);
                    return false;
                }
            }
            return false;
        },
    },
};
