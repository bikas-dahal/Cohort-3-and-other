import {getLatestNews} from "@/lib/news";
import NewsList from "@/components/news-lists";

export default function LatestPage()  {
    const latestNews = getLatestNews()

    return(
        <div>
            <div className='p-3 bg-blue-300 m-2 rounded-2xl text-black'>
                Latest News:
            </div>
            <NewsList news={latestNews}/>
        </div>
    )
}