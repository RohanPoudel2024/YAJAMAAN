import React from 'react';
import './Testimonials.css';
// Import testimonial images
import avatar1 from '../assets/avatar1.jpg';
import avatar2 from '../assets/avatar2.jpg';
import avatar3 from '../assets/avatar3.jpg';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      image: avatar1,
      name: "Rajiv Sharma",
      title: "Yajamaan",
      quote: "Yajamaan has transformed how I connect with spiritual services. Their platform made it easy to find authentic Pandits for my family's rituals."
    },
    {
      id: 2,
      image: avatar2,
      name: "Pandit Anand Joshi",
      title: "Verified Pandit",
      quote: "Being a Pandit on Yajamaan has allowed me to serve devotees across the country. The platform respects our traditions while embracing technology."
    },
    {
      id: 3,
      image: avatar3,
      name: "Lakshmi Devi",
      title: "Yajamaan",
      quote: "Finding the right spiritual guidance used to be difficult. With Yajamaan, I can easily connect with knowledgeable Pandits who help me maintain our traditions."
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What People Say</h2>
          <p className="testimonials-subtitle">Stories from our community of Yajamaan and Pandits</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div className="testimonial-card" key={testimonial.id}>
              <div className="quote-icon">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-author">
                <img 
                  src={testimonial.image} 
                  alt={`${testimonial.name}`} 
                  className="testimonial-avatar" 
                />
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-title">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;