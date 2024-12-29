import GoogleProvider from 'next-auth/providers/google'
import connectDB from "@/config/database";
import User from '@/models/User'


const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                },
            },
        }),
    ],
    callbacks: {
        // Invoked a successful sign in
        async signIn({ profile }) {
            try {
                await connectDB();

                if (!profile.email) {
                    console.error("No email found in profile");
                    return false;
                }

                const userExists = await User.findOne({ email: profile.email });

                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name || profile.email.split('@')[0],
                        image: profile.picture,
                    });
                }

                return true;
            } catch (error) {
                console.error("Error during sign-up:", error);
                return false;
            }
        },

        // modify the session
        async session({ session }) {
            // 1. Get the user from db
            const user = await User.findOne({
                email: session.user.email
            })
            // 2. Assign the userid to the session
            session.user.id = user._id.toString()
            // 3. Return the session
            return session
        }
    }
}

export default (authOptions)