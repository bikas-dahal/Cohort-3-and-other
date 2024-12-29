'use client'
//


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm} from "react-hook-form";
import * as z  from 'zod'
import Link from "next/link";
import {useEffect, useState} from "react";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {signInSchema, signUpSchema, verifySchema} from "@/schemas/signUpSchema";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/types/apiResponse";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {signIn, useSession} from "next-auth/react";


const LoginPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const {toast} = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        // defaultValues: {
        //     username: '',
        //     password: ''
        // }
    })

    useEffect(() => {
        if (status === "authenticated") {
            // Redirect to home page if user is authenticated
            router.push("/");
        }
    }, [status, router]);



    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);

        const result = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password
        })
        console.log('Result is', result)
        if (result?.error) {
            toast({
                title: 'Error',
                description: "Invalid credentials",
                variant: 'destructive'
            })
        }

        if (result?.url) {
            router.replace('/');

        }
        setIsSubmitting(false)
    }

    // if (status === "loading") {
    //     // You can return a loading spinner here
    //     return <div><Loader2 className='animate-spin' /> </div>;
    // }


    return(
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type='email' placeholder="email" {...field}  />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder="Passoword" {...field}  />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isSubmitting} type="submit">
                        {isSubmitting ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Submitting
                            </>
                        ) : 'Login'}
                    </Button>
                </form>

            </Form>
            <div>
                Already have an account?
                <Link href='/signup' className='text-blue-500 hover:text-blue-900'>Signup</Link>
            </div>
        </div>
    )

}

export default LoginPage



// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import Link from "next/link";
// // import {(auth), signIn} from "@/(auth)";
// import LoginForm from "@/components/client/form";
// import {signIn, signOut, useSession} from "next-(auth)/react";
// import {redirect} from "next/navigation";
//
// export default function Component() {
//     const { data : session } = useSession();
//     if (session) {
//         return (
//             <>
//             Signed in as {session.user.email}
//                 <button onClick={() => signOut()}>
//                     Sign out
//                 </button>
//             </>
//         )
//     }
//     return (
//         <>
//         Not signed in.
//             <button onClick={() => signIn()}>Login</button>
//         </>
//     )
// }

//
// const LoginPage = async () => {
//     'use server'
//     // const session = await (auth)()
//     // if (session?.user) {
//     //     redirect('/')
//     // }
//
//     return(
//         <div className='flex justify-center items-center h-dvh'>
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Login</CardTitle>
//                     <CardDescription>Enter email and password:</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <LoginForm />
//                 </CardContent>
//                 <CardFooter className='flex flex-col gap-3'>
//                     <span>
//                         Or,
//                     </span>
//                     <form action={
//                         async () => {
//                             'use server'
//                             await signIn('google')
//                         }
//                     }>
//                         <Button type='submit' variant='outline'>Login with Google</Button>
//                     </form>
//                     <div>
//                     Don't have an account? <Button variant='default'><Link href='/signup'>Sign Up</Link></Button>
//                     </div>
//                 </CardFooter>
//             </Card>
//         </div>
//     )
// }
//
// export default LoginPage;