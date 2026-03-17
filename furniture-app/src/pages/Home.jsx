import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Home.css';
import TopNav from '../components/TopNav';
import { FaTimes } from 'react-icons/fa';
import { BsGrid3X3 } from "react-icons/bs";
import { FaHandPointer } from "react-icons/fa";
import { BiCube } from "react-icons/bi";

// Chair images for Hero
import chairDefault from '../assets/chair.png';
import chairBlue from '../assets/chair-blue.png';
import chairRed from '../assets/chair-red.png';
import chairYellow from '../assets/chair-yellow.png';
import chairBrown from '../assets/chair-brown.png';

// Collection images
import chairImg from '../assets/chair1.png';
import tableImg from '../assets/table.png';
import bedImg from '../assets/bed.png';
import chestImg from '../assets/chest.png';
import cupboardImg from '../assets/cupboard.png';

// Section images
import roomImg from '../assets/room.png';
import footerBg from '../assets/footer-bg.png';
import sofaFront from '../assets/sofa-front1.png';



function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(sessionStorage.getItem('userId'));

  const goToDesgin = (event) => {
    if (event) {
      event.preventDefault();
    }

    navigate(isLoggedIn ? "/design" : "/login");
  };

  const goToDesginManagement = (event) => {
    if (event) {
      event.preventDefault();
    }

    navigate(isLoggedIn ? "/designManagement" : "/login");
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => setSelectedItem(item);
  const handleCloseItemModal = () => setSelectedItem(null);

  const scrollToCollections = () => {
    if (collectionsSectionRef.current) {
      collectionsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // HERO STATE
  const [activeColor, setActiveColor] = useState('default');


  // VISUALIZE SECTION STATE
  const [isVisualizeVisible, setIsVisualizeVisible] = useState(false);
  const visualizeSectionRef = useRef(null);


  // COLLECTIONS STATE
  const [isCollectionsVisible, setIsCollectionsVisible] = useState(false);
  const collectionsSectionRef = useRef(null);


  // FOOTER STATE
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerSectionRef = useRef(null);

  // Visualize section intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisualizeVisible(true);
        } else {
          setIsVisualizeVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    if (visualizeSectionRef.current) observer.observe(visualizeSectionRef.current);
    return () => { if (visualizeSectionRef.current) observer.unobserve(visualizeSectionRef.current); };
  }, []);

  // Collections section intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCollectionsVisible(true);
        } else {
          setIsCollectionsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (collectionsSectionRef.current) observer.observe(collectionsSectionRef.current);
    return () => { if (collectionsSectionRef.current) observer.unobserve(collectionsSectionRef.current); };
  }, []);

  // Footer section intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFooterVisible(true);
        } else {
          setIsFooterVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (footerSectionRef.current) observer.observe(footerSectionRef.current);
    return () => { if (footerSectionRef.current) observer.unobserve(footerSectionRef.current); };
  }, []);

  
  // Handle deep-linking to Home sections.
  useEffect(() => {
    if (location.hash === "#collections-section") {
      const timer = setTimeout(() => {
        scrollToCollections({ behavior: "smooth" });
      }, 80);

      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  // Data
  const colors = [
    { id: 'default', colorCode: '#2a2a2a', img: chairDefault },
    { id: 'blue', colorCode: '#1d3a53', img: chairBlue },
    { id: 'red', colorCode: '#501b1b', img: chairRed },
    { id: 'yellow', colorCode: '#746122', img: chairYellow },
    { id: 'brown', colorCode: '#382720', img: chairBrown },
  ];

  const collectionsData = [
    { id: 1, title: 'CHAIRS', image: chairImg, delay: '0.2s', desc: 'Comfortable seating\nfor every space.', details: 'Elegant, ergonomic chairs designed for comfort and style. Available in a range of fabrics and finishes to suit any interior.', dimensions: 'W 60cm × D 65cm × H 90cm', colors: 'Black, White, Grey, Beige' },
    { id: 2, title: 'TABLES', image: tableImg, delay: '0.4s', desc: 'Solid hardwood\nfor any room.', details: 'Solid hardwood tables with minimalist frames. Ideal for dining rooms, living spaces, or home offices.', dimensions: 'W 160cm × D 90cm × H 75cm', colors: 'Walnut, Oak, Matte Black' },
    { id: 3, title: 'BEDS', image: bedImg, delay: '0.6s', desc: 'Luxurious rest\nevery night.', details: 'Luxurious upholstered beds with solid bases. Crafted for a restful night with premium support.', dimensions: 'W 160cm × D 200cm × H 120cm', colors: 'Charcoal, Ivory, Navy' },
    { id: 4, title: 'TABLES CHEST', image: chestImg, delay: '0.8s', desc: 'Storage with\nelegant form.', details: 'Multi-drawer chest tables with clean lines and ample storage. Perfect for bedrooms and hallways.', dimensions: 'W 120cm × D 45cm × H 85cm', colors: 'Dark Oak, Matte Black, White Ash' },
    { id: 5, title: 'CUPBOARD', image: cupboardImg, delay: '1.0s', desc: 'Spacious and\nstylish storage.', details: 'Full-height cupboards with mirrored panels and internal shelving. Tailored for bedrooms and walk-in spaces.', dimensions: 'W 180cm × D 60cm × H 220cm', colors: 'Gloss White, Dark Walnut, Anthracite' },
  ];


  // <div>
  //   <h2>Welcome</h2>
  //   <button onClick={goToDesgin}>Desgin Page</button>
  //   <button onClick={goToDesginManagement}>Design Management</button>
  //   <button onClick={goToProfile}>Profile</button>
  // </div>


  return (
    <>
      <TopNav />





      {/* HERO SECTION  */}

      <section className="hero-container" id="home">

        {/* Left Text */}
        <div className="hero-text-left fade-in-left">
          <h1 className="big-text">
            <span className="script-font">Mo</span>
          </h1>
          <p className="sub-text script-subfont">DESIGN YOUR DREAM SPACE WITH US</p>
        </div>

        {/* Center: Chair Image + Color Rings */}
        <div className="hero-center-wrapper">

          <div className="hero-image-wrapper">
            <img src={chairDefault} className="dummy-chair floating-chair" alt="dummy" />

            {colors.map((item) => (
              <img
                key={item.id}
                src={item.img}
                alt={`${item.id} chair`}
                className={`floating-chair chair-layer ${activeColor === item.id ? 'active' : ''}`}
              />
            ))}
          </div>

          {/* Color Picker */}
          <div className="color-picker-container fade-in-up">
            {colors.map((item) => (
              <button
                key={item.id}
                className={`color-ring ${activeColor === item.id ? 'active-ring' : ''}`}
                style={{ backgroundColor: item.colorCode }}
                onClick={() => setActiveColor(item.id)}
                title={`Change to ${item.id}`}
              />
            ))}
          </div>

        </div>

        {/* Right Text */}
        <div className="hero-text-right fade-in-right">
          <p className="sub-text serif-subfont">COMFORTABLE & THOUGHTFULLY DESIGNED</p>
          <h1 className="big-text">
            <span className="serif-font">Den</span>
          </h1>
        </div>

        {/* Button */}
        <div className="hero-button-container fade-in-up">
          <button className="btn-primary" onClick={goToDesgin}>START DESIGNING</button>
        </div>

      </section>





      {/* VISUALIZE SECTION */}

      <section className="visualize-container" ref={visualizeSectionRef}>

        <div className={`section-header ${isVisualizeVisible ? 'visible' : ''}`}>
          <h2 className="bg-text">REAL TIME</h2>
          <h2 className="fg-text">VISUALIZE YOUR ROOM</h2>
        </div>

        <div className="content-wrapper">
          <div className={`image-circle-container ${isVisualizeVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <img src={roomImg} alt="Modern Room" className="circle-img" />
          </div>

          <div className="features-container">
            <div className={`feature-item ${isVisualizeVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
              <BsGrid3X3 className="feature-icon" />
              <h3>2D GRID LAYOUT</h3>
              <p>Input width/length to<br />size your room.</p>
            </div>

            <div className={`arrow ${isVisualizeVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.6s' }}>
              <svg width="60" height="30" viewBox="0 0 100 50" fill="none">
                <path d="M5 40 Q 50 0 95 30" stroke="#888" strokeWidth="5" fill="none" />
                <path d="M85 20 L 95 30 L 80 35" stroke="#888" strokeWidth="5" fill="none" />
              </svg>
            </div>

            <div className={`feature-item ${isVisualizeVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.8s' }}>
              <FaHandPointer className="feature-icon" />
              <h3>DRAG & DROP</h3>
              <p>Easily place tables,<br />chairs, and sofas.</p>
            </div>

            <div className={`arrow ${isVisualizeVisible ? 'visible' : ''}`} style={{ transitionDelay: '1.0s' }}>
              <svg width="60" height="30" viewBox="0 0 100 50" fill="none">
                <path d="M5 40 Q 50 0 95 30" stroke="#888" strokeWidth="5" fill="none" />
                <path d="M85 20 L 95 30 L 80 35" stroke="#888" strokeWidth="5" fill="none" />
              </svg>
            </div>

            <div className={`feature-item ${isVisualizeVisible ? 'visible' : ''}`} style={{ transitionDelay: '1.2s' }}>
              <BiCube className="feature-icon" />
              <h3>3D<br />VISUALIZATION</h3>
              <p>Instantly view your<br />design in 3D.</p>
            </div>
          </div>
        </div>
      </section>





      {/* COLLECTIONS SECTION */}

      <section id="collections-section" className="collections-container" ref={collectionsSectionRef}>

        <div className={`col-header ${isCollectionsVisible ? 'visible' : ''}`}>
          <h2 className="col-bg-text">COLLECTIONS</h2>
          <h2 className="col-fg-text">EXPLORE OUR</h2>
        </div>

        <div className="collections-grid">
          {collectionsData.map((item) => (
            <div
              key={item.id}
              className={`collection-item ${isCollectionsVisible ? 'visible' : ''}`}
              style={{ transitionDelay: item.delay, cursor: 'pointer' }}
              onClick={() => handleItemClick(item)}
            >
              <img src={item.image} alt={item.title} className="item-img" />
              <h3 className="item-title">{item.title}</h3>
              <p className="item-desc">{item.desc.split('\n')[0]}<br />{item.desc.split('\n')[1]}</p>
            </div>
          ))}
        </div>
        <div className="collections-all-items-row">
          <button className="btn-all-items" onClick={() => navigate("/all-items")}>ALL ITEMS</button>
        </div>
      </section>





      {/* FOOTER SECTION */}

      <footer id="footer-section" className="footer-container" style={{ backgroundImage: `url(${footerBg})` }} ref={footerSectionRef}>
        <div className="footer-overlay"></div>

        <div className="footer-content">
          <div className={`quick-links-container ${isFooterVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
            <h3 className="quick-links-title">Quick Links</h3>
            <ul className="quick-links-list">
              <li><a href="/home" onClick={(e) => { e.preventDefault(); navigate('/home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{`Home`}</a></li>
              <li><a href="/home#collections-section" onClick={(e) => { e.preventDefault(); navigate('/home#collections-section', { replace: true }); scrollToCollections(); }}>{`Collections`}</a></li>
              <li><a href="#design" onClick={goToDesgin}>{`Design`}</a></li>
              <li><a href="#design-management" onClick={goToDesginManagement}>{`Design Management`}</a></li>
            </ul>
          </div>

          <div className={`giant-logo-container ${isFooterVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
            <span className="logo-m">MoDen</span>
          </div>
        </div>

        <div className="footer-bottom">
          <hr className="footer-line" />
          <p className="copyright-text">©MoDen. All Right Reserved.</p>
        </div>

        <img src={sofaFront} alt="Sofa Front Layer" className="sofa-front-layer" />
      </footer>


      {selectedItem && (
        <div className="collection-modal-overlay" onClick={handleCloseItemModal}>
          <div className="collection-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="collection-modal-close-btn" onClick={handleCloseItemModal} aria-label="Close">
              <FaTimes />
            </button>
            <img src={selectedItem.image} alt={selectedItem.title} className="collection-modal-img" />
            <h2 className="collection-modal-title">{selectedItem.title}</h2>
            <p className="collection-modal-details-text">{selectedItem.details}</p>
            <div className="collection-modal-meta">
              <div className="collection-modal-meta-item">
                <span className="collection-modal-meta-label">DIMENSIONS</span>
                <span className="collection-modal-meta-value">{selectedItem.dimensions}</span>
              </div>
              <div className="collection-modal-meta-item">
                <span className="collection-modal-meta-label">COLORS</span>
                <span className="collection-modal-meta-value">{selectedItem.colors}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Home;
