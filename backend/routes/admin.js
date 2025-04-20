const express = require('express');
const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  verifyBrahmin
} = require('../controllers/adminController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');


router.use(protect);
router.use(authorize('admin'));


router.get('/dashboard', getDashboardStats);
router.route('/users')
  .get(getUsers)
  .post(addUser);
router.route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);
router.put('/verify-brahmin/:id', verifyBrahmin);


router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin API is working correctly'
  });
});

module.exports = router;