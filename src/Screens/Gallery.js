import React, { useRef } from 'react';
import styles from '../CSS-MODULES/Gallerys.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';

const Gallery = () => {
  // We create an array of refs to control each category's slider independently
  const scrollRefs = useRef([]);

  const categories = [
    { title: "Audition Highlights", color: "008751", images: [1, 2, 3, 4, 5, 6, 7, 8] },
    { title: "Live Show Extravaganza", color: "FFD700", images: [1, 2, 3, 4, 5, 6, 7, 8] },
    { title: "Behind The Scenes", color: "001a0d", images: [1, 2, 3, 4, 5, 6, 7, 8] }
  ];

  const scroll = (index, direction) => {
    const container = scrollRefs.current[index];
    const scrollAmount = 400; // Adjust based on card width
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
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
                  <button onClick={() => scroll(idx, 'left')}>❮</button>
                  <button onClick={() => scroll(idx, 'right')}>❯</button>
                </div>
              </div>

              
              
              <div 
                className={styles.carouselContainer}
                ref={el => scrollRefs.current[idx] = el}
              >
                <div className={styles.imageTrack}>
                  {cat.images.map((img, i) => (
                    <div key={i} className={styles.imageCard}>
                      <img 
                        src={`https://via.placeholder.com/400x300/${cat.color}/fff?text=${cat.title}+${img}`} 
                        alt="Gallery Item" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default Gallery;