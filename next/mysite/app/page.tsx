// 'use client'

import Cards from '@/components/Cards'

import {InfiniteMovingCards} from "@/components/ui/infinite-moving-cards";
import {Gyan} from "@/models/data.ts";
import {main} from "@popperjs/core";
import * as React from "react"
export default function Home() {
    return (
        <div className="pt-10 bg-gray-100 min-h-screen">
            {/* Cards Section */}
            <div className="container mx-auto px-4">
                <Cards />
            </div>

            {/* Wisdom (Gyan) Section */}
            <div className="m-4 p-6 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg">
                <span className="p-4 text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-blue-600">
                Wisdom (Gyan)
                </span>

                {/* Moving Cards - Left */}
                <div className="h-64 mx-3 my-6 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-300 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden">
                    <InfiniteMovingCards items={Gyan} direction="left" speed="slow" />
                </div>

                {/* Moving Cards - Right */}
                <div className="h-64 mx-3 my-6 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-300 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden">
                    <InfiniteMovingCards items={Gyan} direction="right" speed="slow" />
                </div>
            </div>
        </div>
    );
}



// return(
//     <>
//         <main>
//             <section>
//                 <h1>
//                     Let's send message
//                 </h1>
//                 <p>Let's goo</p>
//             </section>
//             <Carousel
//                 plugins={[AutoPlay({delay: 1000})]}
//                 opts={{
//                     align: "start",
//                 }}
//                 className="w-full max-w-sm"
//             >
//                 <CarouselContent>
//                     {messages.map((message, index) => (
//                         <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
//                             <div className="p-1">
//                                 <Card>
//                                     <CardHeader>{message.title}</CardHeader>
//                                     <CardContent className="flex aspect-square items-center justify-center p-6">
//                                         <span className="text-3xl font-semibold">{message.content}</span>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         </CarouselItem>
//                     ))}
//                 </CarouselContent>
//                 <CarouselPrevious/>
//                 <CarouselNext/>
//             </Carousel>
//         </main>
//         <footer>
//             all right reserverd
//         </footer>
//     </>
// )
// const session = await (auth)()
// const user = (session?.user?.name)
// console.log('session', session)

// const cokks = cookies().get('authjs.session-token')
// console.log(await decode({
//     token: cokks?.value!,
//     salt: cokks?.name,
//     scret: process.env.AUTH_TOKEN
// }))
// console.log(cokks)