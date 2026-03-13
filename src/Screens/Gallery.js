import React, { useRef, useState } from 'react';
import styles from '../CSS-MODULES/Gallerys.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';

// Asset Imports
import naijapic10 from "../assets/naijapic10.jpeg"
import naijapic11 from "../assets/naijapic11.jpeg"
import naijapic12 from "../assets/naijapic12.jpeg"
import naijapic19 from "../assets/naijapic19.jpeg"
import naijapic20 from "../assets/naijapic20.jpeg" 
import naijapic21 from "../assets/naijapic21.jpeg"
import naijavid1 from "../assets/naijavid1.mp4" 
import naijavid2 from "../assets/naijavid2.mp4"
import naijavid3 from  "../assets/naijavid3.mp4"
import naijavi4 from "../assets/naijavi4.mp4"
import naijavid5 from "../assets/naijavid5.mp4"
import naijavid6 from "../assets/naijavid6.mp4"
import naijavid7 from "../assets/naijavid7.mp4"
import naijavid8 from "../assets/naijavid8.mp4"
import naijavid9 from "../assets/naijavid9.mp4"
import naijavid10 from "../assets/naijavid10.mp4";
import naijavid11 from "../assets/naijavid11.mp4"
import naijavid12 from "../assets/naijavid12.mp4"
import naijavid13 from "../assets/naijavid13.mp4"
import naijavid14 from "../assets/naijavid14.mp4"
import naijavid15 from "../assets/naijavid15.mp4"
import naijavid16 from "../assets/naijavid16.mp4"
import naijavid17 from "../assets/naijavid17.mp4"
import naijavid18 from "../assets/naijavid18.mp4"
import naijavid19 from "../assets/naijavid19.mp4"
import naijavid20 from "../assets/naijavid20.mp4"
import naijavid21 from "../assets/naijavid21.mp4"
import naijavid22 from "../assets/naijavid22.mp4"
import naijavid23 from "../assets/naijavid23.mp4"
import naijavid24 from "../assets/naijavid24.mp4"
import naijavid25 from "../assets/naijavid25.mp4"

const Gallery = () => {
  const scrollRefs = useRef([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Define each row as a separate category here
  const categories = [
    { 
      title: "Talents Highlights", 
      media: [
        { type: 'video', url: naijavid1, title: 'Audition Clip 1' },
        { type: 'image', url: naijapic10, title: 'Lagos Auditions' },
        { type: 'image', url: naijapic11, title: 'Backstage Prep' },
        { type: 'image', url: naijapic12, title: 'Talent Showcase' },
        { type: 'image', url: naijapic19, title: 'Golden Buzzer' },
         { type: 'video', url: naijavid2, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid3, title: 'Audition Clip 1' },
         { type: 'video', url: naijavi4, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid5, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid6, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid7, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid8, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid9, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid10, title: 'Audition Clip 1' }
      ] 
    },
    { 
      title: "Live Show Extravaganza", 
      media: [
        { type: 'image', url: naijapic20, title: 'Main Stage Energy' },
        { type: 'video', url: naijavid1, title: 'Live Performance' },
        { type: 'image', url: naijapic21, title: 'Crowd Reaction' },
        { type: 'image', url: naijapic10, title: 'Judges Table' },
         { type: 'video', url: naijavid11, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid12, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid13, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid14, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid15, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid16, title: 'Audition Clip 1' }
      ] 
    },
    { 
      title: "Behind The Scenes", 
      media: [
        { type: 'image', url: naijapic11, title: 'Makeup & Hair' },
        { type: 'image', url: naijapic12, title: 'Rehearsal Hall' },
        { type: 'video', url: naijavid1, title: 'Uncut Moments' },
        { type: 'image', url: naijapic19, title: 'Post-Show Interview' },
         { type: 'video', url: naijavid17, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid18, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid19, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid20, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid21, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid22, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid23, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid24, title: 'Audition Clip 1' },
         { type: 'video', url: naijavid25, title: 'Audition Clip 1' }
      ] 
    }
  ];

  const scroll = (index, direction) => {
    const container = scrollRefs.current[index];
    if (container) {
      const scrollAmount = 400; 
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.galleryPage}>
        <header className={styles.hero}>
          <div className={styles.container}>
            <span className={styles.badge}>📸 Visual Journey</span>
            <h1>Naija Talent Show <span className={styles.greenText}>Gallery</span></h1>
            <p>Explore the moments that define our quest to discover Nigeria's next global superstars.</p>
          </div>
        </header>

        <section className={styles.galleryContent}>
          <div className={styles.container}>
            {/* This map creates one unique section for every object in the categories array */}
            {categories.map((cat, idx) => (
              <div key={idx} className={styles.gallerySection}>
                <div className={styles.sectionHeader}>
                  <h2>{cat.title}</h2>
                  <div className={styles.navBtns}>
                    <button className={styles.navBtn} onClick={() => scroll(idx, 'left')}>❮</button>
                    <button className={styles.navBtn} onClick={() => scroll(idx, 'right')}>❯</button>
                  </div>
                </div>

                {/* By having only one carousel here, the ref is always unique to this category */}
                <div 
                  className={styles.carouselContainer} 
                  ref={el => scrollRefs.current[idx] = el}
                >
                  <div className={styles.imageTrack}>
                    {cat.media.map((item, i) => (
                      <div 
                        key={i} 
                        className={styles.imageCard} 
                        onClick={() => setSelectedMedia(item)}
                      >
                        {item.type === 'video' ? (
                          <div className={styles.videoThumbnail}>
                            <video muted loop className={styles.galleryImage}>
                              <source src={item.url} type="video/mp4" />
                            </video>
                            <div className={styles.playOverlay}>▶</div>
                          </div>
                        ) : (
                          <img src={item.url} alt={item.title} className={styles.galleryImage} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MODAL OVERLAY */}
        {selectedMedia && (
          <div className={styles.modalOverlay} onClick={() => setSelectedMedia(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setSelectedMedia(null)}>&times;</button>
              
              {selectedMedia.type === 'video' ? (
                <video src={selectedMedia.url} controls autoPlay className={styles.expandedMedia} />
              ) : (
                <img src={selectedMedia.url} alt="Expanded View" className={styles.expandedMedia} />
              )}
              
              <div className={styles.modalCaption}>
                <h3>{selectedMedia.title}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Gallery;