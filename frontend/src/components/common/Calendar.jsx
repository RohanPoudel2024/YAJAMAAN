import React, { useState, useEffect } from 'react';
import '../../styles/Calender.css';

const Calendar = () => {
  const monthNames = ["Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
  const gregorianMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [currentMonth, setCurrentMonth] = useState(11); 
  const [currentYear, setCurrentYear] = useState(2079);
  const [selectedDay, setSelectedDay] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [userNotes, setUserNotes] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedHoroscope, setSelectedHoroscope] = useState('Aries');

  const events = {
    1: "New Year (Chaitra Sukla Pratipada)",
    2: "Ram Navami",
    4: "Kamada Ekadashi",
    8: "Hanuman Jayanti",
    9: "Chaitra Purnima / Buddha Purnima",
    10: "Baisakh Sankranti / Bisket Jatra",
    12: "Bratabandha",
    15: "Gorakhkali Puja / Pahan Charhe",
    16: "Sri Swasthani Bratakatha Samapti",
    18: "Ghode Jatra / Krishna Janmashtami",
    20: "Balachaturdashi / Gai Jatra",
    22: "Chaitra Amavasya / Somvati Amavasya",
    23: "Dashain Begins (Ghatasthapana)",
    25: "World Water Day / Chaite Dashain",
    26: "Shree Rama Navami / Chandi Path",
    28: "SEE Exam / Bhairav Puja",
    29: "Chaitra Ekadashi / Haribodhini Ekadashi",
    30: "Maha Shivaratri"
  };

  const horoscopes = {
    "Aries": "Your day is good, you can start new work and plan future endeavors. A great time for spiritual activities.",
    "Taurus": "Financial aspects are favorable. Take care of your health and avoid unnecessary travel today.",
    "Gemini": "Communication skills are enhanced. Good day for meetings and networking opportunities.",
    "Cancer": "Family matters need attention. A good time to resolve long-standing domestic issues.",
    "Leo": "Creative energy is high. Express yourself through arts or leadership activities.",
    "Virgo": "Focus on details brings success. Organize your workspace for better productivity.",
    "Libra": "Relationships flourish today. Balance work and personal life for optimal happiness.",
    "Scorpio": "Transformation is possible. Let go of past grievances and embrace new beginnings.",
    "Sagittarius": "Travel plans may materialize. Educational pursuits are highly favored today.",
    "Capricorn": "Career advancements are likely. Hard work will be recognized by superiors.",
    "Aquarius": "Innovative ideas flow freely. Connect with like-minded individuals for progress.",
    "Pisces": "Spiritual insights are strong. Meditation and prayer bring peace and clarity."
  };

  const upcomingEvents = [
    "SEE 2082 - Compulsory Nepali/ World Poetry Day",
    "World Water Day / Gorakhkali Puja / Balachaturdashi Day",
    "SEE 2082 - Compulsory Mathematics / World Meteorological Day",
    "Ram Navami / Chaitra Navami",
    "Bisket Jatra / New Year Celebrations",
    "Buddha Purnima / Full Moon Ceremony"
  ];

  const getDaysInMonth = () => {
    
    
    if (currentMonth === 0) return 31; 
    if (currentMonth === 1) return 31; 
    if (currentMonth === 2) return 32; 
    if (currentMonth === 3) return 32; 
    if (currentMonth === 4) return 31; 
    if (currentMonth === 5) return 31; 
    if (currentMonth === 6) return 30; 
    if (currentMonth === 7) return 30; 
    if (currentMonth === 8) return 30; 
    if (currentMonth === 9) return 29; 
    if (currentMonth === 10) return 30; 
    if (currentMonth === 11) return 30; 
    return 30;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth <= 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth >= 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
    setSelectedDay(null);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleAddNote = () => {
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (selectedDay && noteText.trim() !== '') {
      const noteKey = `${currentYear}-${currentMonth}-${selectedDay}`;
      setUserNotes(prev => ({
        ...prev,
        [noteKey]: noteText
      }));
      setNoteText('');
      setShowNoteModal(false);
    }
  };

  const handleHoroscopeChange = (e) => {
    setSelectedHoroscope(e.target.value);
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth();
    
    
    const firstDayOffset = 0; 
    
    
    for (let i = 0; i < firstDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    
    for (let i = 1; i <= daysInMonth; i++) {
      const hasEvent = events[i] ? true : false;
      const isSpecialDay = i === 8 || i === 9 || i === 15 || i === 26 ? true : false;
      const isSelected = selectedDay === i;
      const noteKey = `${currentYear}-${currentMonth}-${i}`;
      const hasNote = userNotes[noteKey] ? true : false;

      days.push(
        <div 
          key={i} 
          className={`calendar-day ${isSpecialDay ? 'special-day' : ''} ${isSelected ? 'selected-day' : ''}`}
          onClick={() => handleDayClick(i)}
        >
          <span className="day-number">{i}</span>
          {hasEvent && <div className="event-indicator">{events[i]}</div>}
          {hasNote && <div className="note-indicator">✎</div>}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="container">
      <div className="calendar-wrapper">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="event-list">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-dot"></div>
                  <span>{event}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="sidebar-section">
            <h2 className="section-title">My Notes</h2>
            <button className="add-note-btn" onClick={handleAddNote}>Add Note</button>
            {selectedDay ? (
              <div className="selected-day-notes">
                <h3>Notes for {monthNames[currentMonth]} {selectedDay}, {currentYear}</h3>
                <p>
                  {userNotes[`${currentYear}-${currentMonth}-${selectedDay}`] || 'No notes yet. Click "Add Note" to create one.'}
                </p>
              </div>
            ) : (
              <p>Select a day to view or add notes.</p>
            )}
          </div>
          
          <div className="sidebar-section">
            <h2 className="section-title">Horoscope</h2>
            <select 
              className="horoscope-select" 
              value={selectedHoroscope} 
              onChange={handleHoroscopeChange}
            >
              {Object.keys(horoscopes).map((sign) => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
            <p className="horoscope-text">{selectedHoroscope}: {horoscopes[selectedHoroscope]}</p>
          </div>
        </div>
        
        {/* Calendar */}
        <div className="calendar">
          <div className="calendar-header">
            <button className="month-nav-btn" onClick={handlePrevMonth}>
              &lt;
            </button>
            <div className="month-display">
              <h2 className="current-month">{monthNames[currentMonth]} {currentYear}</h2>
              <p className="gregorian-date">
                {gregorianMonthNames[(currentMonth + 2) % 12]}/{gregorianMonthNames[(currentMonth + 3) % 12]} 2025
              </p>
            </div>
            <button className="month-nav-btn" onClick={handleNextMonth}>
              &gt;
            </button>
          </div>
          
          <div className="weekday-row">
            <div className="weekday-header sunday">Sunday</div>
            <div className="weekday-header">Monday</div>
            <div className="weekday-header">Tuesday</div>
            <div className="weekday-header">Wednesday</div>
            <div className="weekday-header">Thursday</div>
            <div className="weekday-header">Friday</div>
            <div className="weekday-header saturday">Saturday</div>
          </div>
          
          <div className="calendar-grid">
            {renderCalendarDays()}
          </div>
          
          {selectedDay && events[selectedDay] && (
            <div className="event-details">
              <h3>Events on {monthNames[currentMonth]} {selectedDay}</h3>
              <p>{events[selectedDay]}</p>
            </div>
          )}
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Note for {monthNames[currentMonth]} {selectedDay}, {currentYear}</h3>
            <textarea 
              className="note-textarea" 
              value={noteText} 
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note here..."
            ></textarea>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button className="modal-btn save" onClick={handleSaveNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;