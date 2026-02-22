import React, { useState } from 'react';
import styles from '../CSS-MODULES/gallery.module.css';

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  

  const mediaItems = [
    // YouTube Video - Now handled by the getEmbedUrl helper
    { id: 1, type: 'video', category: 'performance', url: 'https://www.youtube.com/watch?v=1SxTR7PFVWI', title: 'Vocal Performance - Lagos', isYouTube: true },
    { id: 2, type: 'image', category: 'audition', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4', title: 'Abuja Auditions' },
    { id: 3, type: 'image', category: 'performance', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', title: 'Main Stage Energy' },
    // Direct MP4 Video
    { id: 4, type: 'video', category: 'behind-the-scenes', url: 'https://www.w3schools.com/html/movie.mp4', title: 'Training Camp', isYouTube: false },
    { id: 5, type: 'image', category: 'audition', url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81', title: 'Talent Screening' },
    { id: 6, type: 'image', category: 'performance', url: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d', title: 'Dance Highlights' },
  ];

  // HELPER FUNCTION: Converts "watch" links to "embed" links and adds muting
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/') + "?autoplay=0&mute=1";
    }
    if (url.includes('youtu.be/')) {
        return url.replace('youtu.be/', 'youtube.com/embed/') + "?autoplay=0&mute=1";
    }
    return url;
  };

  const filteredMedia = filter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === filter);

  const handlePlay = (e) => {
    const video = e.target;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => console.log("Playback interrupted safely"));
    }
  };

  const handlePause = (e) => {
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
                <div className={styles.videoWrapper}>
                  {item.isYouTube ? (
                    <iframe 
                      className={styles.videoItem}
                      src={getEmbedUrl(item.url)}
                      title={item.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video 
                      className={styles.videoItem} 
                      muted 
                      loop 
                      onMouseOver={handlePlay} 
                      onMouseOut={handlePause}
                    >
                      <source src={item.url} type="video/mp4" />
                    </video>
                  )}
                  <div className={styles.indicator}></div>
                </div>
              ) : (
                <div className={styles.imageWrapper}>
                  <img src={item.url} alt={item.title} className={styles.imageItem} />
                  <div className={`${styles.indicator} ${styles.photoBadge}`}></div>
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
            See Full Gallery <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;