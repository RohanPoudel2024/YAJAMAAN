
const asyncHandler = require('../middleware/async');
const User = require('../models/User');


console.log('Brahmin controller loaded');




exports.searchBrahmins = asyncHandler(async (req, res, next) => {
  try {
    console.log('Search brahmins endpoint hit');
    const { location, ritual, date, minRating } = req.query;
    
    console.log('Search params:', req.query);
    
    
    const filter = { role: 'brahmin' };
    
    if (location && location !== '') {
      filter.location = { $regex: location, $options: 'i' }; 
    }
    
    if (ritual && ritual !== '') {
      
      filter['brahminDetails.specialization'] = { $regex: ritual, $options: 'i' };
    }
    
    if (minRating && minRating !== '0') {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    console.log('Filter:', filter);
    
    
    const brahmins = await User.find(filter)
      .select('name location profileImage brahminDetails rating isVerified reviewCount')
      .sort({ rating: -1 });
    
    console.log(`Found ${brahmins.length} brahmins`);
    
    
    const transformedData = brahmins.map(brahmin => ({
      _id: brahmin._id,
      name: brahmin.name,
      location: brahmin.location || 'Location not specified',
      profileImage: brahmin.profileImage,
      specializations: brahmin.brahminDetails?.specialization || [],
      rating: brahmin.rating || 0,
      reviewCount: brahmin.reviewCount || 0,
      isAvailable: true, 
      experience: brahmin.brahminDetails?.experience || 0,
      priceRange: "Rs. 5,000 - Rs. 25,000" 
    }));
    
    res.status(200).json({
      success: true,
      count: transformedData.length,
      data: transformedData
    });
  } catch (error) {
    console.error('Error in searchBrahmins:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while searching brahmins'
    });
  }
});




exports.getBrahminById = asyncHandler(async (req, res, next) => {
  const brahmin = await User.findById(req.params.id);
  
  if (!brahmin || brahmin.role !== 'brahmin') {
    return res.status(404).json({
      success: false,
      error: 'Brahmin not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: brahmin
  });
});