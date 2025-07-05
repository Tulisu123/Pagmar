export const videosService = {
  getVideos,
}

async function getVideos() {
  const NUMBER_OF_VIDEOS = 12
  const BASE_URL = 'https://pagmarpullzone.b-cdn.net'
  const CACHE_KEY = 'cachedVideos'

  // Check cache
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (Array.isArray(parsed) && parsed.length === NUMBER_OF_VIDEOS) {
        return parsed
      }
    } catch (e) {
      console.warn('Corrupted cache, fetching fresh videos.')
    }
  }

  // Generate list
  const videoList = []
  for (let i = 1; i <= NUMBER_OF_VIDEOS; i++) {
    videoList.push({
      id: i,
      url: `${BASE_URL}/compressed_${i}.mp4`,
    })
  }

  // Cache it
  localStorage.setItem(CACHE_KEY, JSON.stringify(videoList))
  return videoList
}
