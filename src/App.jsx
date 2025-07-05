import { useEffect, useState, useRef } from 'react'
import './App.css'
import { videosService } from './videosService'

function App() {
  const [videos, setVideos] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const videoRef = useRef()
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

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

  const handleVideoEnd = () => {
    setCurrentIdx((prevIdx) => (prevIdx + 1) % videos.length)
  }

  const handleNext = () => {
    setCurrentIdx((prevIdx) => (prevIdx + 1) % videos.length)
  }

  const handlePrev = () => {
    setCurrentIdx((prevIdx) => (prevIdx - 1 + videos.length) % videos.length)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext() // swipe left
      } else {
        handlePrev() // swipe right
      }
    }
  }

  if (!videos.length) return (
    <div style={{ color: 'white' }}>
      Loading video...
    </div>
  )

  const videoSrc = videos[currentIdx]?.url

  return (
    <div
      className="video-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        onEnded={handleVideoEnd}
        playsInline
        preload="auto"
        className="fullscreen-video"
      />

      <button className="nav-btn left" onClick={handlePrev}>←</button>
      <button className="nav-btn right" onClick={handleNext}>→</button>
    </div>
  )
}

export default App
