const router = require('express').Router();
const {
  createCardValidation,
  cardIdValidation,
} = require('../middlewares/validations');
module.exports = router;

const {
  getCard,
  removeCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cardController');

router.get('/cards', getCard);
router.delete('/cards/:cardId', removeCardById);
router.post('/cards', createCardValidation, createCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes',cardIdValidation, dislikeCard);
