import React from 'react'
import {cn, formatDate} from "@/lib/utils";
import {EyeIcon} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Author, Comment, Quote} from "@/sanity/types";
import {Skeleton} from "@/components/ui/skeleton";

export type PhilosophyTypeCard = Omit<Quote, 'author'> & { author?: Author };

export type CommentTypeCard = Omit<Comment, 'author'> & { author?: Author };

const PhilosophyCard = ({post}: {post: PhilosophyTypeCard}) => {

    const { _createdAt, views, author, title, category, _id, image, description } = post;

    return (
        <li className={'startup-card group '}>
            <div className={'flex-between'}>
                <p className={'startup-card_date'}>
                    {formatDate(_createdAt)}
                </p>
                <div className={'flex gap-1.5'}>
                    <EyeIcon className={'size-5 text-primary'} />
                    <span className={'text-16-medium'}>{views}</span>
                </div>
            </div>

            <div className={'flex-between mt-5 gap-5'}>
                <div className={'flex-1'}>
                    <Link href={`/user/${author?._id}`}>
                        <p className={'text-16-medium line-clamp-1'}>{author?.name}</p>
                    </Link>
                    <Link href={`/quote/${_id}`}>
                        <h3 className={'text-26-semibold line-clamp-1'}>{title}</h3>
                    </Link>
                </div>
                <Link href={`/user/${author?._id}`}>
                    <Image src={author?.image} alt={author?.name} width={48} height={48} className={'rounded-full'} />
                </Link>
            </div>
            <Link href={`/quote/${_id}`}>
                <p className={'startup-card_desc'}>{description}</p>
                <img src={image} alt={'placeholder'} className={'startup-card_img'} />
            </Link>

            <div className={'flex-between gap-5 mt-5'}>
                <Link href={`/?query=${category?.toLowerCase()}`}>
                    <p className={'text-16-medium line-clamp-1'}>{category}</p>
                </Link>
                <Button className={'startup-card_btn'} asChild>
                    <Link href={`/quote/${_id}`}>
                        Details
                    </Link>
                </Button>
            </div>
        </li>
    )
}

export const PhilosophyCardSkeleton = () => (
    <>
        {[0, 1, 2, 3, 4].map(( index:number) => (
            <li key={cn('skeleton', index)}>
                <Skeleton className={'startup-card_skeleton'} />
            </li>
        ))}
    </>
)

export default PhilosophyCard
