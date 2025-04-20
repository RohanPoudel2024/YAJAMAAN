import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DownloadApp from '../components/DownloadApp';
import BlogSection from '../components/BlogSection'; // Import the new component
import Testimonials from '../components/Testimonials';
import './Home.css';
import ritImg from '../assets/ritimg.jpg';
import secImg from '../assets/secimg.jpg';
import { Navigate, useNavigate } from 'react-router-dom';



const Home = () => {
  const navigate = useNavigate();
  const [statsVisible, setStatsVisible] = useState(false);

  const handleBrahminClick = (e) => {
    e.preventDefault();
    navigate('/signup', { state: { preSelectBrahmin: true } });
  };

  const handleYajamaan = (e) => {
    e.preventDefault();
    navigate('/signup', { state: { preSelectYajamaan: true } });
  };

  useEffect(() => {
    // Show stats automatically after page load with a delay
    const timer = setTimeout(() => {
      setStatsVisible(true);
    }, 500);

    const handleScroll = () => {
      // Keep the scroll functionality as a backup
      if (!statsVisible) {
        const stats = document.querySelector('.stats');
        if (stats) {
          const statsPosition = stats.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / 1.3;

          if (statsPosition < screenPosition) {
            setStatsVisible(true);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };

    
  }, [statsVisible]);

  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="text-content">
              <h1 className="title">#YAJAMAAN</h1>
              <p className="description">Your Digital Gateway to Divine Rituals!</p>
              <div className="buttons">
                <a href="#" className="earn-button" onClick={handleBrahminClick}>💰 Earn with Yajamaan ➡</a>
                <a href="#" className="get-started-button" onClick={handleYajamaan}>📱 Get Started ➡</a>
              </div>
            </div>
            
            <div className="image-content">
              <img src={ritImg} alt="Yajaman" className="hero-image" />
            </div>
          </div>
          
          <div className={`stats ${statsVisible ? 'stats-animate' : ''}`}>
            <div className="stat">
              <h2 className="stat-number">10,000+</h2>
              <p className="stat-description">Daily Users</p>
            </div>
            <div className="stat">
              <h2 className="stat-number">50,000+</h2>
              <p className="stat-description">Yajaman's Served</p>
            </div>
            <div className="stat">
              <h2 className="stat-number">100,000+</h2>
              <p className="stat-description">Lives impacted</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="earn-promo">
        <div className="container">
          <h2 className="earn-title">Earn with Your Spiritual Knowledge</h2>
          <p className="earn-description">Become a Pandit on the highest earning platform for spiritual services!</p>
          <button className="start-earning-button" onClick={handleBrahminClick}>
            Start Earning
            <i className="fas fa-arrow-right"></i>
          </button>
          
          <div className="earn-image-container">
            <img 
              src={secImg} 
              alt="Illustration of Pandits earning with Yajamaan" 
              className="earn-image" 
            />
          </div>
        </div>
      </section>
      

      <DownloadApp />
      

      <BlogSection />

      <Testimonials/>
      
      <Footer />
    </div>
  );
};

export default Home;