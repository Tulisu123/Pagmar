import { useEffect, useState, useRef } from 'react'
import './App.css'
import GridCmp from './GridCmp.jsx'
import { videosService } from './videosService'

function App() {
  const [videos, setVideos] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showGrid, setShowGrid] = useState(false)
  const [minDuration, setMinDuration] = useState(0)
  const videoRef = useRef()

  useEffect(() => {
    async function fetchData() {
      try {
        const vids = await videosService.getVideos()
        console.log('PEXELS KEY:', import.meta.env.VITE_PEXELS_API_KEY);
        console.log('Fetched videos:', vids)
        setVideos(vids)

        const durations = vids.map(v => v.duration)
        setMinDuration(Math.min(...durations))
      } catch (err) {
        console.error('Error fetching videos:', err)
      }
    }
    fetchData()
  }, [])

  const handleVideoEnd = () => {
    const nextIdx = (currentIdx + 1) % videos.length

    // Show grid every 1 video (not on first video)
    if (nextIdx % 1 === 0 && nextIdx !== 0) {
      setShowGrid(true)
      setTimeout(() => {
        setCurrentIdx(nextIdx)
        setShowGrid(false)
      }, minDuration * 1000)
    } else {
      setCurrentIdx(nextIdx)
    }
  }

  const handleGridItemClick = (index) => {
    setCurrentIdx(index)
    setShowGrid(false)
  }

  if (!videos.length) return (
    <div style={{ color: 'white' }}>
      loading video
    </div>
  );

  return (
    <>
      <div className="header-container">
        <div className="topHeader">
          <p className="topheader-title">קריאה בעידן הדיגיטלי</p>   
          <p className="nispah">נספח: 3</p>
        </div>
        <div className="bottomHeader">
          <p className="subline">הפרטיות של הקריאה נשמרת חלקית אפילו כשאר היא מבוצעת בפני אחרים</p>
        </div>
        {!showGrid && (
          <div className="user-details">
            <p className="user-name">שם משתמש: שי</p>
            <p className="user-title">גיל: 27</p>
            <p className="user-title">זמן קריאה: 5.34 דק׳</p>
          </div>
        )}
      </div>
      {showGrid ? (
          <GridCmp data={videos} onItemClick={handleGridItemClick} />
        ) : (
          <div onClick={() => setShowGrid(true)} className="user-display-container" style={{ width: '100vw', height: 'calc(100vh - 75px)', display: 'flex', flexDirection: 'column', padding: 0, margin: 0 }}>
            <div className='video-div'>
              <video
                ref={videoRef}
                src={
                  videos[currentIdx]?.video_files.find(f => f.file_type === 'video/mp4')?.link || ''
                }
                autoPlay
                muted
                onEnded={handleVideoEnd}
                playsInline
                preload="auto"
              ></video>
            </div>
            <div className='video-div'>
              <video
                src={
                  videos[(currentIdx + 1) % videos.length]?.video_files.find(f => f.file_type === 'video/mp4')?.link || ''
                }
                autoPlay
                muted
                playsInline
                preload="auto"
              ></video>
            </div>
          </div>
        )}
    </>
  )
}

export default App
