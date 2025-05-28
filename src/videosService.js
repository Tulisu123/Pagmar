const API_KEY = 'FmS8GjuU942mjxdJSQrZBmnoSpFV0U98h2hoyCRtt1xSXoy8iFQRUOMH';
const NUMBER_OF_VIDEOS = 25;

export const videosService = {
    getVideos,
}

async function getVideos() {
  const res = await fetch(`https://api.pexels.com/videos/search?query=nature&per_page=${NUMBER_OF_VIDEOS}&size=medium&orientation=landscape`, {
    headers: {
      Authorization: API_KEY
    }
  })
  const data = await res.json();
  return data.videos
}