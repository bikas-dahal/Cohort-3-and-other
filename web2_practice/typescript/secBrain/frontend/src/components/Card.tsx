import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";

interface CardProps {
    title: string
    link: string
    type: 'youtube' | 'twitter'
}

export function Card ({title, link, type}: CardProps) {
    return (
        <div className="w-72 m-2 p-2 shadow-md rounded-md border border-slate-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ShareIcon />
                    {title}
                </div>
                <div className="flex items-center gap-x-2">
                    <PlusIcon size="md" />
                    <a href={link} target="_blank" rel="noreferrer">
                    <ShareIcon />
                    </a>
                </div>
            </div>
            <div className="w-full rounded-md  ">
                {type === 'youtube' &&  (
                    <iframe className="w-full rounded-md mt-2 " src={link.replace('watch', 'embed').replace('?v=', '/')} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                )}
                {type === 'twitter' && (
                    <>
                    <blockquote className="twitter-tweet"> <a href={link.replace('x.com', 'twitter.com')}></a></blockquote>
                    </>
                )}
            
            </div>
        </div>
    )
}