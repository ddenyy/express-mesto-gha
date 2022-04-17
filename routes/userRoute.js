const router = require('express').Router();

module.exports = router;

const {
  getUser,
  getUserById,
  createUser,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/userController');

router.get('/users', getUser);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUserData);
router.patch('/users/me/avatar', updateUserAvatar);
