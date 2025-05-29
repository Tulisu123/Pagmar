const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const NUMBER_OF_VIDEOS = 25;

export const videosService = {
    getVideos,
}

async function getVideos() {
    const res = await fetch('/.netlify/functions/get-videos');
    const data = await res.json();
    return data;
}