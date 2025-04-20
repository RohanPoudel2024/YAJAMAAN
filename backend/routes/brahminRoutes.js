const express = require('express');
const { 
  searchBrahmins,
  getBrahminById
  
} = require('../controllers/brahminController');

const router = express.Router();

router.get('/search', searchBrahmins);
router.get('/:id', getBrahminById);

// Get all registered brahmins
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const brahmins = await User.find({ role: 'brahmin' })
      .select('name location profileImage brahminDetails rating isVerified reviewCount')
      .sort({ createdAt: -1 })
      .limit(limit);
      
    // Format the data for frontend
    const formattedData = brahmins.map(brahmin => ({
      _id: brahmin._id,
      name: brahmin.name,
      location: brahmin.location || 'Location not specified',
      profileImage: brahmin.profileImage,
      specializations: brahmin.brahminDetails?.specialization || [],
      rating: brahmin.rating || 0,
      reviewCount: brahmin.reviewCount || 0,
      isVerified: brahmin.isVerified || false
    }));
    
    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching brahmins:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch brahmin data'
    });
  }
});

router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Brahmin routes are working correctly'
  });
});

module.exports = router;