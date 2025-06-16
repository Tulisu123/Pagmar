export default function GridCmp({ data = [], onItemClick }) {
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
      </div>

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
