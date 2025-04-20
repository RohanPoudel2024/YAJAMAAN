import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Signup.css';

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState('Yajamaan');
  const [district, setDistrict] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // List of all 77 districts in Nepal
  const nepalDistricts = [
    "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", 
    "Bara", "Bardiya", "Bhaktapur", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", 
    "Dang", "Darchula", "Dhading", "Dhankuta", "Dhanusa", "Dolakha", "Dolpa", 
    "Doti", "Eastern Rukum", "Gorkha", "Gulmi", "Humla", "Ilam", "Jajarkot", 
    "Jhapa", "Jumla", "Kailali", "Kalikot", "Kanchanpur", "Kapilvastu", "Kaski", 
    "Kathmandu", "Kavrepalanchok", "Khotang", "Lalitpur", "Lamjung", "Mahottari", 
    "Makwanpur", "Manang", "Morang", "Mugu", "Mustang", "Myagdi", "Nawalparasi East", 
    "Nawalparasi West", "Nuwakot", "Okhaldhunga", "Palpa", "Panchthar", "Parbat", 
    "Parsa", "Pyuthan", "Ramechhap", "Rasuwa", "Rautahat", "Rolpa", "Rupandehi", 
    "Salyan", "Sankhuwasabha", "Saptari", "Sarlahi", "Sindhuli", "Sindhupalchok", 
    "Siraha", "Solukhumbu", "Sunsari", "Surkhet", "Syangja", "Tanahun", "Taplejung", 
    "Terhathum", "Udayapur", "Western Rukum"
  ];

  // Check if we should pre-select Brahmin based on navigation state
  useEffect(() => {
    if (location.state && location.state.preSelectBrahmin) {
      setProfileType('Brahmin');
    } else if (location.state && location.state.preSelectYajamaan) {
      setProfileType('Yajamaan');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!fullName || !email || !phoneNumber || !password || !profileType || !district) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Convert profileType to the backend's expected role format
    const role = profileType.toLowerCase() === 'brahmin' ? 'brahmin' : 'yajaman';

    try {
      const response = await register({
        name: fullName,
        email,
        password,
        role,
        phone: phoneNumber,
        location: district
      });
      
      console.log('Registration successful:', response);
      setIsLoading(false);
      
      // Force hard navigation to refresh the page and ensure new auth state is loaded
      window.location.href = '/whats-today';
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-page">
        <div className="signup-container">
          <h2>{profileType === 'Brahmin' ? 'Join as a Brahmin' : 'Sign Up'}</h2>
          {error && <p className="signup-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              className="district-select"
            >
              <option value="">Select District</option>
              {nepalDistricts.map((dist, index) => (
                <option key={index} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              required
            >
              <option value="Yajamaan">Yajamaan</option>
              <option value="Brahmin">Brahmin</option>
            </select>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;