import React, { useRef, useState, useEffect } from 'react';
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

const Gallery = () => {
  const scrollRefs = useRef([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const modalVideoRef = useRef(null);

  // Trigger play when modal opens
  useEffect(() => {
    if (selectedMedia && selectedMedia.type === 'video' && modalVideoRef.current) {
      modalVideoRef.current.load();
      modalVideoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, [selectedMedia]);

  const categories = [
    { 
      title: "Talents Highlights", 
      media: [
        { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440356/naijavid16_wr3wjm.mp4" },
        { type: 'image', url: naijapic10 },
        { type: 'image', url: naijapic11 },
        { type: 'image', url: naijapic12, title: 'Talent Showcase' },
        { type: 'image', url: naijapic19},
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440300/naijavid24_uuodln.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440298/naijavid23_dqkyww.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440288/naijavid12_imbuuk.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440283/naijavid19_zmozun.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440272/naijavid22_xtpyrf.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440270/naijavid20_vs3gk6.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440265/naijavid21_f33zbu.mp4" },
         { type: 'video', url: 'https://res.cloudinary.com/duxagntku/video/upload/v1773440136/naijavid25_orui81.mp4' },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773439993/naijavid2_porbpi.mp4" }
      ] 
    },
    { 
      title: "Live Show Extravaganza", 
      media: [
        { type: 'image', url: naijapic20, title: 'Main Stage Energy' },
        { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440398/naijavid11_bbeo1m.mp4" },
        { type: 'image', url: naijapic21, title: 'Crowd Reaction' },
        { type: 'image', url: naijapic10, title: 'Judges Table' },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773439993/naijavid2_porbpi.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440974/naijavid1_hrpcbb.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440400/naijavid32_kgsthg.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440401/naijavid18_oc7nnq.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440399/naijavid13_aaphlq.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440398/naijavid11_bbeo1m.mp4" }
      ] 
    },
    { 
      title: "Behind The Scenes", 
      media: [
        { type: 'image', url: naijapic11, title: 'Makeup & Hair' },
        { type: 'image', url: naijapic12, title: 'Rehearsal Hall' },
        { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440398/naijavid15_ugw3ov.mp4" },
        { type: 'image', url: naijapic20 },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440395/naijavid10_meo7ci.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440393/naijavid6_rs2bzl.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440392/naijavid8_pmkrp9.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440389/naijavid28_o5fx3e.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440389/naijavid7_blxii1.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440383/naijavi4_xgjz4u.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440369/naijavid5_ut6ie0.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440361/naijavid31_ryk8ro.mp4" },
         { type: 'video', url: "https://res.cloudinary.com/duxagntku/video/upload/v1773440359/naijavid30_oqnt2s.mp4" }
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
            {categories.map((cat, idx) => (
              <div key={idx} className={styles.gallerySection}>
                <div className={styles.sectionHeader}>
                  <h2>{cat.title}</h2>
                  <div className={styles.navBtns}>
                    <button className={styles.navBtn} onClick={() => scroll(idx, 'left')}>❮</button>
                    <button className={styles.navBtn} onClick={() => scroll(idx, 'right')}>❯</button>
                  </div>
                </div>

                <div className={styles.carouselContainer} ref={el => scrollRefs.current[idx] = el}>
                  <div className={styles.imageTrack}>
                    {cat.media.map((item, i) => (
                      <div key={i} className={styles.imageCard} onClick={() => setSelectedMedia(item)}>
                        {item.type === 'video' ? (
                          <div className={styles.videoThumbnail}>
                            <video 
                              muted 
                              loop 
                              autoPlay 
                              playsInline
                              preload="metadata"
                              poster={item.url.replace(".mp4", ".jpg")} 
                              className={styles.galleryImage}
                            >
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

        {selectedMedia && (
          <div className={styles.modalOverlay} onClick={() => setSelectedMedia(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setSelectedMedia(null)}>&times;</button>
              
              {selectedMedia.type === 'video' ? (
                <video 
                  ref={modalVideoRef}
                  src={selectedMedia.url} 
                  controls 
                  autoPlay 
                  playsInline
                  className={styles.expandedMedia} 
                />
              ) : (
                <img src={selectedMedia.url} alt="Expanded View" className={styles.expandedMedia} />
              )}
              
              <div className={styles.modalCaption}>
                <h3>{selectedMedia.title || "Gallery Moment"}</h3>
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