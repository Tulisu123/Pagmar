export default function GridCmp({ data = [], onItemClick }) {
  return (
    <>
      <div className="video-container">
        {data.slice(0, 36).map((video, index) => (
          <div key={index} className="grid-item">
            <video
              onClick={() => onItemClick(index)}
              src={video.video_files.find(f => f.file_type === 'video/mp4')?.link || ''}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
            />
          </div>
        ))}
      </div>
    </>
  );
}
