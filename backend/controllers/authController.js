const User = require('../models/User');
const asyncHandler = require('../middleware/async');




exports.register = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      location,
      brahminDetails: role === 'brahmin' ? {
        specialization: req.body.specialization || [],
        experience: req.body.experience || 0,
        languages: req.body.languages || [],
        bio: req.body.bio || ''
      } : undefined,
      yajamanDetails: role === 'yajaman' ? {
        preferredLanguages: req.body.preferredLanguages || [],
        preferredRituals: req.body.preferredRituals || []
      } : undefined
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use. Please use another email or login.'
      });
    }
    
    next(err);
  }
});




exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an email and password'
    });
  }

  
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  sendTokenResponse(user, 200, res);
});




exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});




exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});




exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    location: req.body.location
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});




exports.uploadProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please upload an image file' 
    });
  }

  try {
    
    const filePath = `/uploads/profiles/${req.file.filename}`;
    console.log('Saving image path to database:', filePath);
    console.log('Full file path on disk:', req.file.path);
    
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: filePath },
      { new: true }
    );

    console.log('Updated user with new profile image:', user.profileImage);

    res.status(200).json({
      success: true,
      data: { 
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error updating profile image' 
    });
  }
});


const sendTokenResponse = (user, statusCode, res) => {
  
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: user
    });
};