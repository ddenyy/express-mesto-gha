const Card = require('../models/card');
// get запрос на все карточки
module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports.removeCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'карточка не найдена' });
      }
      return res.status(500).send({ message: 'ошибка на сервере' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({
      name: card.name,
      link: card.link,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(500).send({ message: 'ошибка на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.send({ message: err.message }));
};
