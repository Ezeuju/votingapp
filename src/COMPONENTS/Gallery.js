import React, { useState } from 'react';
import styles from '../CSS-MODULES/gallery.module.css';
import naijavid1 from "../assets/naijavid1.mp4";
import naijavid2 from "../assets/naijavid2.mp4"
import naijavid3 from "../assets/naijavid3.mp4"
import naijavi4 from "../assets/naijavi4.mp4"
import naijavid5 from "../assets/naijavid5.mp4"
import naijavid6 from "../assets/naijavid6.mp4"
import naijapic10 from "../assets/naijapic10.jpeg";
import naijapic11 from "../assets/naijapic11.jpeg";
import naijapic12 from "../assets/naijapic12.jpeg";
import naijapic13 from "../assets/naijapic13.jpeg";
import naijapic14 from "../assets/naijapic14.jpeg";
import naijapic15 from "../assets/naijapic15.jpeg"
// import naijapic16 from "../assets/naijapic16.jpeg"

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const mediaItems = [
    { id: 1, type: 'video', category: 'performance', url: naijavid1, title: 'Naija Talent' },
    { id: 2, type: 'video', category: 'audition', url: naijavid2, title: 'Naija Talent Show' },
    { id: 3, type: 'video', category: 'audition', url: naijavid3, title: 'Naija Talent Show' },
    { id: 4, type: 'video', category: 'audition', url: naijavi4, title: 'Naija Talent Show' },
    { id: 5, type: 'video', category: 'audition', url: naijavid5, title: 'Naija Talent Show' },
    { id: 6, type: 'video', category: 'audition', url: naijavid6, title: 'Naija Talent Show' },
    { id: 7, type: 'image', category: 'performance', url: naijapic10, title: 'Naija Talent Show' },
    { id: 8, type: 'image', category: 'performance', url: naijapic11, title: 'Naija Talent Show' },
    { id: 9, type: 'image', category: 'performance', url: naijapic12, title: 'Naija Talent Show' },
    { id: 10, type: 'image', category: 'performance', url: naijapic13, title: 'Naija Talent Show' },
    { id: 11, type: 'image', category: 'performance', url: naijapic14, title: 'Naija Talent Show' },
    { id: 12, type: 'image', category: 'performance', url: naijapic15, title: 'Naija Talent Show' }
   
  ];

  const getEmbedUrl = (url) => {
    if (typeof url !== 'string') return url;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/') + "?autoplay=1";
    }
    if (url.includes('youtu.be/')) {
        return url.replace('youtu.be/', 'youtube.com/embed/') + "?autoplay=1";
    }
    return url;
  };

  const filteredMedia = filter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === filter);

  const handleHoverPlay = (e) => {
    e.target.play().catch(() => {});
  };

  const handleHoverPause = (e) => {
    e.target.pause();
  };

  return (
    <section className={styles.gallerySection} id="gallery">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Showcase of <span className={styles.greenText}>Global Talent</span></h2>
          <p>Witness the journey from raw talent to superstar artistry.</p>
        </div>

        {/* Filter Bar - Using setFilter here fixes the "unused variable" warning */}
        <div className={styles.filterBar}>
          {['all', 'performance', 'audition', 'behind-the-scenes'].map((cat) => (
            <button 
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat.replace(/-/g, ' ')}
            </button>
          ))}
        </div>

        <div className={styles.mediaGrid}>
          {filteredMedia.map((item) => (
            <div key={item.id} className={styles.mediaCard}>
              {item.type === 'video' ? (
                <div className={styles.videoWrapper} onClick={() => setSelectedVideo(item)}>
                  {item.isYouTube ? (
                    <div className={styles.youtubePlaceholder}>
                        <p>Play Video</p>
                    </div>
                  ) : (
                    <video 
                      className={styles.videoItem} 
                      muted 
                      loop 
                      onMouseOver={handleHoverPlay} 
                      onMouseOut={handleHoverPause}
                    >
                      <source src={item.url} type="video/mp4" />
                    </video>
                  )}
                  <div className={styles.indicator}></div>
                </div>
              ) : (
                <div className={styles.imageWrapper}>
                  <img src={item.url} alt={item.title} className={styles.imageItem} />
                </div>
              )}
              
              <div className={styles.mediaInfo}>
                <span className={styles.tag}>{item.category}</span>
                <h4>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footerAction}>
          <button className={styles.seeMoreBtn}>
            <a href="/gallery">See Full Gallery <span>→</span></a>
          </button>
        </div>

        {/* Modal Overlay */}
        {selectedVideo && (
          <div className={styles.modalOverlay} onClick={() => setSelectedVideo(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setSelectedVideo(null)}>&times;</button>
              
              {selectedVideo.isYouTube ? (
                <iframe 
                  className={styles.expandedVideo}
                  src={getEmbedUrl(selectedVideo.url)}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video 
                  className={styles.expandedVideo} 
                  controls 
                  autoPlay 
                  src={selectedVideo.url}
                >
                </video>
              )}
              <div className={styles.modalTitle}>
                <h3>{selectedVideo.title}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// CRITICAL: This fixes the "Attempted import error"
export default Gallery;