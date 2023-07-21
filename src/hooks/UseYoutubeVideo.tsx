import React, { useState } from 'react';
import { fetchYoutubeVideo } from '../apis/Youtube';

export interface YoutubeVideo {
    title : string;
    thumbnailUrl : string;
    description : string;

}

export function useYoutubeVideo () {
    const [youtubeVideo, setYoutubeVideo] = useState<YoutubeVideo|null>(null);
    const handler =  (event: React.ChangeEvent<HTMLInputElement>) => {
        const youtubeVideoUrl = event.target.value;
        fetchYoutubeVideo(extractVideoIdFromUrl(youtubeVideoUrl)).then((data)=>{
            setYoutubeVideo(getYoutubeVideoFromMetedata(data.items[0]));
        });
        
    }
    function extractVideoIdFromUrl(url: string) {
        const match = url.match(/(?:[?&]v=|\/embed\/|\/v\/|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : '';
    }
    
    return {youtubeVideo, handler};
}

export function getYoutubeVideoFromMetedata (youtubeVideoMetadata:any) : YoutubeVideo {
        return {
            'title' : youtubeVideoMetadata.snippet.title,
            'thumbnailUrl' : youtubeVideoMetadata.snippet.thumbnails?.default?.url || '',
            'description' : youtubeVideoMetadata.snippet.description.slice(0, 500)
        }
}

