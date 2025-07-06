import { useEffect, useState, useRef } from 'react'
import './App.css'
import { videosService } from './videosService'

function App() {
  const [videos, setVideos] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [nextIdx, setNextIdx] = useState(null)
  const [isPortrait, setIsPortrait] = useState(false)
  const [animationDirection, setAnimationDirection] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

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

  const handleDirection = (direction) => {
    if (isAnimating || videos.length < 2) return

    const newIndex =
      direction === 'left'
        ? (currentIdx + 1) % videos.length
        : (currentIdx - 1 + videos.length) % videos.length

    setNextIdx(newIndex)
    setAnimationDirection(direction)
    setIsAnimating(true)

    setTimeout(() => {
      setCurrentIdx(newIndex)
      setNextIdx(null)
      setAnimationDirection(null)
      setIsAnimating(false)
    }, 400) // match transition duration
  }

  const handleNext = () => handleDirection('left')
  const handlePrev = () => handleDirection('right')

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
  const nextVideo = nextIdx !== null ? videos[nextIdx] : null

  return (
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
        className={`fullscreen-video ${animationDirection === 'left' ? 'swipe-out-left' : animationDirection === 'right' ? 'swipe-out-right' : ''}`}
      />

      {nextVideo && (
        <video
          key={nextVideo.id}
          src={nextVideo.url}
          autoPlay
          muted
          playsInline
          preload="auto"
          className={`fullscreen-video ${animationDirection === 'left' ? 'swipe-in-right' : 'swipe-in-left'}`}
        />
      )}

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
  )
}

export default App
