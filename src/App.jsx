import { useEffect, useState, useRef } from 'react'
import './App.css'
import { videosService } from './videosService'

function App() {
  const [videos, setVideos] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isPortrait, setIsPortrait] = useState(false)
  const [activeBuffer, setActiveBuffer] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const videoRefs = [useRef(null), useRef(null)]
  const touchStartX = useRef(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const vids = await videosService.getVideos()
        setVideos(vids)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching videos:', err)
        setIsLoading(false)
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

  const handleVideoEnd = () => {
    handleNext()
  }

  const handleNext = () => {
    setCurrentIdx((prevIdx) => (prevIdx + 1) % videos.length)
    setActiveBuffer((prev) => 1 - prev)
  }

  const handlePrev = () => {
    setCurrentIdx((prevIdx) => (prevIdx - 1 + videos.length) % videos.length)
    setActiveBuffer((prev) => 1 - prev)
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

  if (isLoading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  )

  const currentVideo = videos[currentIdx]
  const nextVideo = videos[(currentIdx + 1) % videos.length]

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
        {[currentVideo, nextVideo].map((video, i) => (
          <video
            key={video.id}
            ref={videoRefs[i]}
            src={video.url}
            autoPlay={i === activeBuffer}
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
            className="fullscreen-video"
            style={{ display: i === activeBuffer ? 'block' : 'none' }}
          />
        ))}

        <button className="nav-btn left" onClick={handlePrev}>←</button>
        <button className="nav-btn right" onClick={handleNext}>→</button>
      </div>
    </>
  )
}

export default App
