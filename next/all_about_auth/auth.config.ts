import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import Google from "@auth/core/providers/google";

import {LoginSchema} from "@/schemas";

import type { NextAuthConfig } from "next-auth";
import {getUserByEmail} from "@/data/user";
import bcrypt from "bcryptjs";

export default {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedData = LoginSchema.safeParse(credentials);
                // console.log('first')

                if (validatedData.success) {
                    const { email, password } = validatedData.data
                    const user = await getUserByEmail(email)
                    // console.log('second')

                    if (!user || !user.password) {
                        return null
                    }
                    // console.log('user', user)
                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (passwordMatch) return user
                }
                // console.log('failed')

                return null

            }
        })
    ],

} satisfies NextAuthConfig