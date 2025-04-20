import React from 'react';
import './BlogSection.css';
// Import your local blog images
import blog1Image from '../assets/blog1.jpg';
import blog2Image from '../assets/blog2.jpg';
import blog3Image from '../assets/blog3.jpg';
// You'll need to import Font Awesome if you haven't already
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const BlogSection = () => {
  // Blog post data - you can move this to a separate file if needed
  const blogPosts = [
    {
      id: 1,
      image: blog1Image,
      category: "Newsroom",
      date: "September 26, 2024",
      title: "नयाँ पूजा अनुष्ठान सेवाहरूको सुरुवात - याजमानमा उपलब्ध!"
    },
    {
      id: 2,
      image: blog2Image,
      category: "Newsroom",
      date: "September 12, 2024",
      title: "याजमानमा अब Brahmin सेवा बुक गर्नु सजिलो भयो!"
    },
    {
      id: 3,
      image: blog3Image,
      category: "Newsroom",
      date: "June 19, 2024",
      title: "याजमान प्लेटफर्ममा नयाँ पूजा सामाग्री को विक्री सुरु!"
    }
  ];
  
  

  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="blog-header">
          <h2 className="blog-title">From the Blog</h2>
          <a href="#" className="blog-link">
            Go to Blog
            <i className="fas fa-arrow-right"></i>
            {/* If using Font Awesome React: <FontAwesomeIcon icon={faArrowRight} /> */}
          </a>
        </div>
        <div className="blog-grid">
          {blogPosts.map(post => (
            <div className="blog-card" key={post.id}>
              <img 
                src={post.image} 
                alt={`Blog post about ${post.title}`} 
                className="blog-image" 
              />
              <div className="blog-content">
                <div className="blog-meta">
                  <span>{post.category}</span>
                  <span className="meta-separator">•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="blog-post-title">{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;