import { useEffect, useState, useRef } from 'react'
import './App.css'
import { videosService } from './videosService'

function App() {
  const [videos, setVideos] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isPortrait, setIsPortrait] = useState(false)
  const videoRef = useRef(null)
  const touchStartX = useRef(null)

  // 🔁 טריגר לסקרול קטן להעלים toolbar
  useEffect(() => {
    const scrollToHideToolbar = () => {
      window.scrollTo(0, 1)
    }

    const debounceScroll = () => {
      clearTimeout(window._scrollTimeout)
      window._scrollTimeout = setTimeout(scrollToHideToolbar, 100)
    }

    // הרצה מיידית + בהתחלה
    debounceScroll()

    // כשמשנים אוריינטציה
    window.addEventListener('orientationchange', debounceScroll)

    // כשמשנים גודל (כמו כשעוברים full screen)
    window.addEventListener('resize', debounceScroll)

    // מגע ראשון במסך – גיבוי
    window.addEventListener('touchstart', debounceScroll, { once: true })

    return () => {
      window.removeEventListener('orientationchange', debounceScroll)
      window.removeEventListener('resize', debounceScroll)
      window.removeEventListener('touchstart', debounceScroll)
    }
  }, [])

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
