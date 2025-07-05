export const videosService = {
  getVideos,
}

async function getVideos() {
  const NUMBER_OF_VIDEOS = 12
  const LOCAL_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // אפשר לעדכן רק מה שכווץ שוב
  const videoList = []

  for (let i = 1; i <= NUMBER_OF_VIDEOS; i++) {
    const isLocal = LOCAL_IDS.includes(i)
    const url = isLocal
      ? `/videos/compressed_again_${i}.mp4`
      : `https://pagmarpullzone.b-cdn.net/compressed_${i}.mp4`

    videoList.push({
      id: i,
      url,
    })
  }

  return videoList
}
