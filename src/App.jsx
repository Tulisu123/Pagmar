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

  if (!videos.length) return <div>Loading...</div>

  return (
    <>
      {showGrid ? (
        <GridCmp data={videos} onItemClick={handleGridItemClick} />
      ) : (
        <div onClick={() => setShowGrid(true)} className="wrapper">
          <video
            className="fullscreen-video"
            ref={videoRef}
            src={
              videos[currentIdx].video_files.find(f => f.file_type === 'video/mp4')?.link || ''
            }
            autoPlay
            muted
            onEnded={handleVideoEnd}
          />
        </div>
      )}
    </>
  )
}

export default App
