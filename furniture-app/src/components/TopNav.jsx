import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import Profile from '../pages/Profile';
import './TopNav.css';

function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const isAdminPage = location.pathname === '/adminHome' || location.pathname === '/userManagement';
  const isLoggedIn = Boolean(sessionStorage.getItem('userId'));
  const [scrolled, setScrolled] = useState(!isHomePage);

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
      return undefined;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = (event) => {
    event.preventDefault();
    closeMobileMenu();

    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(location.pathname, { replace: true });
      return;
    }

    navigate('/');
  };

  const handleCollectionsClick = (event) => {
    event.preventDefault();
    closeMobileMenu();

    if (isHomePage) {
      navigate(`${location.pathname}#collections-section`, { replace: true });
      const collectionsSection = document.getElementById('collections-section');

      if (collectionsSection) {
        collectionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      return;
    }

    navigate('/home#collections-section');
  };

  const handleNavigation = (event, path) => {
    event.preventDefault();
    closeMobileMenu();
    navigate(isLoggedIn ? path : '/login');
  };

  const handleLoginClick = (event) => {
    event.preventDefault();
    closeMobileMenu();
    navigate('/login');
  };

  const handlePublicNavigation = (event, path) => {
    event.preventDefault();
    closeMobileMenu();
    navigate(path);
  };

  return (
    <>
      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="top-navbar-logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          <span className="top-logo-text">MoDen</span>
        </div>

        <ul className={isMobileMenuOpen ? 'top-nav-links-mobile' : 'top-nav-links'} onClick={closeMobileMenu}>
          {isAdminPage ? (
            <>
              <li><a href="/adminHome" className="top-nav-item" onClick={(event) => handlePublicNavigation(event, '/adminHome')}>Admin Home</a></li>
              <li><a href="/userManagement" className="top-nav-item" onClick={(event) => handlePublicNavigation(event, '/userManagement')}>User Management</a></li>
            </>
          ) : (
            <>
              <li><a href="/home" className="top-nav-item" onClick={handleHomeClick}>HOME</a></li>
              <li><a href="/home#collections-section" className="top-nav-item" onClick={handleCollectionsClick}>COLLECTIONS</a></li>
              <li><a href="/guidelines" className="top-nav-item" onClick={(event) => handlePublicNavigation(event, '/guidelines')}>GUIDELINES</a></li>
              <li><a href="/design" className="top-nav-item" onClick={(event) => handleNavigation(event, '/design')}>DESIGN</a></li>
              <li><a href="/designManagement" className="top-nav-item" onClick={(event) => handleNavigation(event, '/designManagement')}>DESIGN MANAGEMENT</a></li>
            </>
          )}
        </ul>

        <div className="top-navbar-icons">
          {isLoggedIn ? (
            <FaUserCircle className="top-profile-icon" onClick={() => setIsProfileOpen(true)} />
          ) : (
            <button className="top-login-link" onClick={handleLoginClick}>
              LOGIN
            </button>
          )}
        </div>

        <button className="top-mobile-menu-icon" onClick={() => setIsMobileMenuOpen((current) => !current)} aria-label="Toggle navigation menu">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {isLoggedIn && <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />}
    </>
  );
}

export default TopNav;