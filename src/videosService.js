const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const NUMBER_OF_VIDEOS = 40;

export const videosService = {
    getVideos,
}

async function getVideos() {
  const res = await fetch(`https://api.pexels.com/videos/search?query=nature&per_page=${NUMBER_OF_VIDEOS}&size=large&orientation=portrait`, {
    headers: {
      Authorization: API_KEY
    }
  })
  const data = await res.json();
  return data.videos
}