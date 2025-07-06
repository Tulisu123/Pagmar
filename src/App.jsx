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
    setCurrentIdx(nextIdx)
  }

  const handlePrev = () => {
    const prevIdx = (currentIdx - 1 + videos.length) % videos.length
    setCurrentIdx(prevIdx)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev()
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
      <div
        className="video-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
          className={`fullscreen-video ${isPortrait ? 'contain-mode' : ''}`}
        />

        {!isPortrait && (
          <>
            <button className="nav-btn left" onClick={handlePrev}>‹</button>
            <button className="nav-btn right" onClick={handleNext}>›</button>
          </>
        )}

        {isPortrait && (
          <div className="orientation-overlay">
            <p>Please rotate your device to landscape mode.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default App
