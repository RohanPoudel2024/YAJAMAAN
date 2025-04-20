const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  uploadProfileImage
} = require('../controllers/authController');

const router = express.Router();
const { protect } = require('../middleware/auth');


const uploadDirectory = path.join(__dirname, '../public/uploads/profiles');
if (!fs.existsSync(path.join(__dirname, '../public/uploads'))) {
  fs.mkdirSync(path.join(__dirname, '../public/uploads'), { recursive: true });
}
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function(req, file, cb) {
    cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: function(req, file, cb) {
    
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.put('/updatedetails', protect, updateDetails);
router.post('/profile-image', protect, upload.single('profileImage'), uploadProfileImage);

module.exports = router;