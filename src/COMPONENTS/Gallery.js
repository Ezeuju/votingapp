import React, { useState } from 'react';
import styles from '../CSS-MODULES/gallery.module.css';
import naijapic10 from "../assets/naijapic10.jpeg";
import naijapic11 from "../assets/naijapic11.jpeg";
import naijapic12 from "../assets/naijapic12.jpeg";
import naijapic13 from "../assets/naijapic13.jpeg";
import naijapic14 from "../assets/naijapic14.jpeg";
import naijapic15 from "../assets/naijapic15.jpeg";

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const mediaItems = [
    // Updated with your Cloudinary Video URLs
    { id: 1, type: 'video', category: 'performance', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440327/naijavid27_ehotnl.mp4", title: 'Naija Talent Highlights' },
    { id: 2, type: 'video', category: 'audition', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440307/naijavid26_ggfpxo.mp4", title: 'Naija Audition Clip' },
    { id: 3, type: 'video', category: 'audition', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440300/naijavid24_uuodln.mp4", title: 'Naija Rising Star' },
    { id: 4, type: 'video', category: 'audition', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440298/naijavid23_dqkyww.mp4", title: 'Global Audition' },
    { id: 5, type: 'video', category: 'audition', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440288/naijavid12_imbuuk.mp4", title: 'Superstar Journey' },
    { id: 6, type: 'video', category: 'audition', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440283/naijavid19_zmozun.mp4", title: 'Talent Showcase' },
    
    // Images
    { id: 7, type: 'image', category: 'performance', url: naijapic10, title: 'Naija Talent Show' },
    { id: 8, type: 'image', category: 'performance', url: naijapic11, title: 'Naija Talent Show' },
    { id: 9, type: 'image', category: 'performance', url: naijapic12, title: 'Naija Talent Show' },
    { id: 10, type: 'image', category: 'performance', url: naijapic13, title: 'Naija Talent Show' },
    { id: 11, type: 'image', category: 'performance', url: naijapic14, title: 'Naija Talent Show' },
    { id: 12, type: 'image', category: 'performance', url: naijapic15, title: 'Naija Talent Show' }
  ];

  // const getEmbedUrl = (url) => {
  //   if (typeof url !== 'string') return url;
  //   if (url.includes('youtube.com/watch?v=')) {
  //     return url.replace('watch?v=', 'embed/') + "?autoplay=1";
  //   }
  //   if (url.includes('youtu.be/')) {
  //       return url.replace('youtu.be/', 'youtube.com/embed/') + "?autoplay=1";
  //   }
  //   return url;
  // };

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
                  <video 
                    className={styles.videoItem} 
                    muted 
                    loop 
                    onMouseOver={handleHoverPlay} 
                    onMouseOut={handleHoverPause}
                    preload="metadata"
                  >
                    {/* The #t=0.1 ensures a preview frame is shown instead of a blank screen */}
                    <source src={`${item.url}#t=0.1`} type="video/mp4" />
                  </video>
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
              
              <video 
                className={styles.expandedVideo} 
                controls 
                autoPlay 
                src={selectedVideo.url}
              >
              </video>
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

export default Gallery;