const router = require('express').Router();
module.exports = router;

const {
    getCard,
    removeCardById,
    createCard,
    likeCard,
    dislikeCard
} = require('../controllers/cardController.js');

router.get('/cards', getCard);
router.delete('/cards/:cardId', removeCardById);
router.post('/cards', createCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard)