import { useEffect, useState, useRef } from 'react'
import './App.css'
import { videosService } from './videosService'

function App() {
  const [videos, setVideos] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isPortrait, setIsPortrait] = useState(false)
  const videoRef = useRef(null)
  const touchStartX = useRef(null)

  
    useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const resizeVideo = () => {
      const screenRatio = window.innerWidth / window.innerHeight;
      const videoRatio = 16 / 9; // או תחלץ מ־video.videoWidth / video.videoHeight

      if (screenRatio > videoRatio) {
        video.style.width = '100vw';
        video.style.height = 'auto';
      } else {
        video.style.width = 'auto';
        video.style.height = '100vh';
      }
    };

    resizeVideo();

    window.addEventListener('resize', resizeVideo);
    return () => window.removeEventListener('resize', resizeVideo);
  }, []);


  useEffect(() => {
    async function fetchData() {
      try {
        const vids = await videosService.getVideos()
        setVideos(vids)
      } catch (err) {
        console.error('Error fetching videos:', err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.matchMedia("(orientation: portrait)").matches
      setIsPortrait(portrait)
    }

    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  const handleNext = () => {
    const nextIdx = (currentIdx + 1) % videos.length
    console.log("▶️ Playing next video:", videos[nextIdx]?.url)
    setCurrentIdx(nextIdx)
  }

  const handlePrev = () => {
    const prevIdx = (currentIdx - 1 + videos.length) % videos.length
    console.log("▶️ Playing previous video:", videos[prevIdx]?.url)
    setCurrentIdx(prevIdx)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext()
      else handlePrev()
    }
  }

  if (!videos.length) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  }

  const currentVideo = videos[currentIdx]

  return (
    <>
      {isPortrait && (
        <div className="orientation-warning">
          <p>Please rotate your device to landscape mode for the best experience.</p>
        </div>
      )}
      <div
        className="video-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ display: isPortrait ? 'none' : 'block' }}
      >
        <video
          key={currentVideo.id}
          ref={videoRef}
          src={currentVideo.url}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleNext}
          className="fullscreen-video"
        />

        <button className="nav-btn left" onClick={handlePrev}>←</button>
        <button className="nav-btn right" onClick={handleNext}>→</button>
      </div>
    </>
  )
}

export default App
