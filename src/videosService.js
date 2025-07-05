export const videosService = {
  getVideos,
}

async function getVideos() {
  const NUMBER_OF_VIDEOS = 12
  const BASE_URL = 'https://pagmarpullzone.b-cdn.net'

  const videoList = []
  for (let i = 1; i <= NUMBER_OF_VIDEOS; i++) {
    videoList.push({
      id: i,
      url: `${BASE_URL}/compressed_again_${i}.mp4?v`, 
    })
  }

  return videoList
}