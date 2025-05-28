export default function GridCmp({ data = [], onItemClick }) {
  return (
    <div className="wrapper">
      <div className="grid">
        {data.map((video, index) => (
          <div key={index} className="grid-item">
            <video
              onClick={() => onItemClick(index)}
              src={video.video_files.find(f => f.file_type === 'video/mp4')?.link || ''}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              muted
              autoPlay
              playsInline //for mobile use 
              preload="auto"
              loop
            />
          </div>
        ))}
      </div>
    </div>
  )
}
