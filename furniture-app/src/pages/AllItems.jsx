import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import Profile from './Profile';
import './AllItems.css';
import TopNav from '../components/TopNav';


import chairImg          from '../assets/chair2.png';
import tableImg          from '../assets/table1.png';
import bedImg            from '../assets/bed1.png';
import chestImg          from '../assets/chest2.png';
import cupboardImg       from '../assets/cupboard1.png';
import sofaImg           from '../assets/sofas.png';
import chairOriginalImg  from '../assets/chair-original.png';
import chairBlueImg      from '../assets/lounge chairs.png';
import chairRedImg       from '../assets/dining chairs.png';
import chairYellowImg    from '../assets/accent chairs.png';
import chairBrownImg     from '../assets/classic chairs.png';
import chairDefaultImg   from '../assets/side chairs.png';
import sofaFrontImg      from '../assets/two seater sofas.png';
import sidetablesImg     from '../assets/side tables.png';
import bunkbedsImg       from '../assets/bunk beds1.png';
import OttomansImg       from '../assets/Ottomans.png';


const allItemsData = [
  { id: 1,  title: 'CHAIRS',          image: chairImg,          desc: 'Comfortable seating\nfor every space.',       details: 'Elegant, ergonomic chairs designed for comfort and style. Available in a range of fabrics and finishes to suit any interior.',                  dimensions: 'W 60cm × D 65cm × H 90cm',  colors: 'Black, White, Grey, Beige'          },
  { id: 2,  title: 'TABLES',          image: tableImg,          desc: 'Solid hardwood\nfor any room.',               details: 'Solid hardwood tables with minimalist frames. Ideal for dining rooms, living spaces, or home offices.',                                         dimensions: 'W 160cm × D 90cm × H 75cm', colors: 'Walnut, Oak, Matte Black'           },
  { id: 3,  title: 'BEDS',            image: bedImg,            desc: 'Luxurious rest\nevery night.',                details: 'Luxurious upholstered beds with solid bases. Crafted for a restful night with premium support.',                                                dimensions: 'W 160cm × D 200cm × H 120cm',colors: 'Charcoal, Ivory, Navy'             },
  { id: 4,  title: 'CHEST',           image: chestImg,          desc: 'Storage with\nelegant form.',                 details: 'Multi-drawer chests with clean lines and ample storage. Perfect for bedrooms and hallways.',                                                    dimensions: 'W 120cm × D 45cm × H 85cm', colors: 'Dark Oak, Matte Black, White Ash'  },
  { id: 5,  title: 'CUPBOARDS',       image: cupboardImg,       desc: 'Spacious and\nstylish storage.',              details: 'Full-height cupboards with mirrored panels and internal shelving. Tailored for bedrooms and walk-in spaces.',                                   dimensions: 'W 180cm × D 60cm × H 220cm',colors: 'Gloss White, Dark Walnut, Anthracite'},
  { id: 6,  title: 'SOFAS',           image: sofaImg,           desc: 'Refined comfort\nfor living rooms.',          details: 'Contemporary sofas with deep cushioning and premium upholstery. Available in sectional and two-seater configurations.',                         dimensions: 'W 240cm × D 95cm × H 80cm', colors: 'Cream, Slate Grey, Mocha'         },
  { id: 7,  title: 'ARMCHAIRS',       image: chairOriginalImg,  desc: 'Classic form,\nmodern comfort.',              details: 'Generously proportioned armchairs upholstered in premium fabric. Ideal for reading nooks and living rooms.',                                    dimensions: 'W 80cm × D 85cm × H 95cm',  colors: 'Sage Green, Rust, Midnight Blue'  },
  { id: 8,  title: 'LOUNGE CHAIRS',   image: chairBlueImg,      desc: 'Sleek lines,\nrelaxed living.',               details: 'Low-profile lounge chairs with clean architectural silhouettes. Perfect for open-plan living areas.',                                           dimensions: 'W 75cm × D 80cm × H 80cm',  colors: 'Ocean Blue, Charcoal, Off-White'  },
  { id: 9,  title: 'DINING CHAIRS',   image: chairRedImg,       desc: 'Elevate your\ndining experience.',            details: 'Upholstered dining chairs built for style and durability. Pairs beautifully with any dining table.',                                            dimensions: 'W 55cm × D 60cm × H 88cm',  colors: 'Burgundy, Caramel, Stone'         },
  { id: 10, title: 'ACCENT CHAIRS',   image: chairYellowImg,    desc: 'A bold statement\nfor any corner.',           details: 'Vibrant accent chairs to add personality to any room. Statement pieces that combine art and function.',                                         dimensions: 'W 70cm × D 72cm × H 92cm',  colors: 'Mustard, Terracotta, Forest Green'},
  { id: 11, title: 'CLASSIC CHAIRS',  image: chairBrownImg,     desc: 'Timeless design,\nlasting quality.',          details: 'Timeless classic chairs with hand-crafted wooden legs and premium upholstery. Built to last generations.',                                      dimensions: 'W 62cm × D 66cm × H 90cm',  colors: 'Espresso, Tobacco, Dark Chocolate'},
  { id: 12, title: 'SIDE CHAIRS',     image: chairDefaultImg,   desc: 'Versatile seating\nfor any room.',            details: 'Lightweight side chairs that move effortlessly between rooms. From dining to desk, they adapt to every need.',                                  dimensions: 'W 50cm × D 55cm × H 85cm',  colors: 'Graphite, Pearl, Espresso'        },
  { id: 13, title: 'TWO SEAT SOFAS',  image: sofaFrontImg,      desc: 'Intimate comfort\nfor two.',                  details: 'Compact two-seat sofas that bring elegance to smaller living spaces without sacrificing comfort.',                                              dimensions: 'W 170cm × D 90cm × H 80cm', colors: 'Dove Grey, Blush, Caramel'        },
  { id: 14, title: 'SIDE TABLES',     image: sidetablesImg,     desc: 'Functional beauty\nbeside you.',              details: 'Slim side tables in solid wood and metal finishes. Perfect companions for sofas, armchairs, and beds.',                                         dimensions: 'W 50cm × D 50cm × H 55cm',  colors: 'Natural Oak, Smoked Oak, Black'   },
  { id: 15, title: 'BUNK BEDS',       image: bunkbedsImg,       desc: 'Smart sleeping\nfor shared rooms.',           details: "Sturdy bunk beds with solid construction and safety rails. Designed for children's rooms and guest rooms alike.",                               dimensions: 'W 100cm × D 200cm × H 170cm',colors: 'White, Pine, Anthracite'          },
  { id: 16, title: 'OTTOMANS',        image: OttomansImg,       desc: 'Rest, store\nand display.',                   details: 'Versatile ottoman storage units upholstered in premium fabric. Serve as seating, foot rests, or coffee tables.',                                dimensions: 'W 90cm × D 50cm × H 45cm',  colors: 'Velvet Cobalt, Linen Cream, Suede Grey'},
];

function AllItems() {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const gridRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.05 }
        );
        if (gridRef.current) observer.observe(gridRef.current);
        return () => { if (gridRef.current) observer.unobserve(gridRef.current); };
    }, []);

    useEffect(() => {
        if (!selectedItem) return;
        const handleEsc = (e) => { if (e.key === 'Escape') setSelectedItem(null); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [selectedItem]);

    return (
        <>
            <TopNav />

            {/* ALL ITEMS SECTION */}
            <section className="ai-section">
                <div className="ai-section-header">
                    <h2 className="ai-bg-text">ALL ITEMS</h2>
                    <h2 className="ai-fg-text">EXPLORE ALL</h2>
                </div>

                <div className="ai-grid" ref={gridRef}>
                    {allItemsData.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`ai-item ${isVisible ? 'visible' : ''}`}
                            style={{ transitionDelay: `${idx * 0.06}s` }}
                            onClick={() => setSelectedItem(item)}
                        >
                            <img src={item.image} alt={item.title} className="ai-item-img" />
                            <h3 className="ai-item-title">{item.title}</h3>
                            <p className="ai-item-desc">{item.desc.split('\n')[0]}<br />{item.desc.split('\n')[1]}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ITEM POPUP MODAL */}
            {selectedItem && (
                <div className="ai-modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="ai-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="ai-modal-close" onClick={() => setSelectedItem(null)} aria-label="Close">
                            <FaTimes />
                        </button>
                        <img src={selectedItem.image} alt={selectedItem.title} className="ai-modal-img" />
                        <h2 className="ai-modal-title">{selectedItem.title}</h2>
                        <p className="ai-modal-details">{selectedItem.details}</p>
                        <div className="ai-modal-meta">
                            <div className="ai-modal-meta-item">
                                <span className="ai-modal-meta-label">DIMENSIONS</span>
                                <span className="ai-modal-meta-value">{selectedItem.dimensions}</span>
                            </div>
                            <div className="ai-modal-meta-item">
                                <span className="ai-modal-meta-label">COLORS</span>
                                <span className="ai-modal-meta-value">{selectedItem.colors}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </>
    );
}

export default AllItems;
