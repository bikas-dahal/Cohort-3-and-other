

import NewsList from "@/components/news-list";
import {useEffect, useState} from "react";

const NewsPage = async () => {
    const response = await fetch("http://localhost:8080/news");

    if (!response.ok) {
        throw new Error('Failed to fetch news lists.');
    }

    const news = await response.json()

    return (

            <div className='text-cyan-400'>
                <NewsList news={news} />
            </div>
    )
}

export default NewsPage