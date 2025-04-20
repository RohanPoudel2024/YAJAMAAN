const User = require('../models/User'); 
const Ritual = require('../models/ritual'); 
const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/async');




exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});




exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User not found with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});




exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User not found with id of ${req.params.id}`
    });
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});




exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User not found with id of ${req.params.id}`
    });
  }

  
  await User.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});




exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  
  const totalUsers = await User.countDocuments();
  const brahminCount = await User.countDocuments({ role: 'brahmin' });
  const yajamanCount = await User.countDocuments({ role: 'yajaman' });
  
  
  let bookingCount = 0;
  let ritualCount = 0;
  
  try {
    bookingCount = await Booking.countDocuments();
  } catch (err) {
    console.log('Booking model might not be fully implemented yet');
  }
  
  try {
    ritualCount = await Ritual.countDocuments();
  } catch (err) {
    console.log('Ritual model might not be fully implemented yet');
  }
  
  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        brahmins: brahminCount,
        yajamans: yajamanCount
      },
      bookings: bookingCount,
      rituals: ritualCount
    }
  });
});




exports.verifyBrahmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User not found with id of ${req.params.id}`
    });
  }

  if (user.role !== 'brahmin') {
    return res.status(400).json({
      success: false,
      error: 'User is not a brahmin'
    });
  }

  user.isVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});




exports.addUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone, location } = req.body;

  try {
    
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

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use. Please use another email.'
      });
    }
    next(err);
  }
});