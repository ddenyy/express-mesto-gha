const router = require('express').Router();
module.exports = router;

const {
  getUser,
  getUserById,
  createUser,
} = require('../controllers/userController.js');

router.get('/users', getUser);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);