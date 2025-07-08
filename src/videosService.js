export const videosService = {
  getVideos,
}

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
}

async function getVideos() {
  const NUMBER_OF_VIDEOS = 12
  const BASE_URL = 'https://pagmarpullzone.b-cdn.net/final-layout' // עדכון לתיקייה החדשה
  const isMobile = isMobileDevice()

  const videoList = []
  for (let i = 1; i <= NUMBER_OF_VIDEOS; i++) {
    const prefix = isMobile ? 'compressed_final_mobile_' : 'compressed_final_desktop_'
    videoList.push({
      id: i,
      url: `${BASE_URL}/${prefix}${i}.mp4`,
    })
  }

  return videoList
}
