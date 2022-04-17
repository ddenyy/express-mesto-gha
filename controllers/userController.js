const User = require('../models/user');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL,
} = require('../constants');
// get запрос на всех пользователей
module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(ERROR_INTERNAL).send({ message: err.message }));
};

// get запрос на конкретного пользователя по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({message: 'пользователь с таким id не найден'})
      }
      res.status(200).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Невалидный id пользователя' });
      } else if (err.name === 'NotFound') {
        res.status(ERROR_INTERNAL).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы Невалидные данные пользователя при создании' });
      }
      res.status(ERROR_INTERNAL).send({ err: err.message });
    });
};

module.exports.updateUserData = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(ERROR_NOT_FOUND).send({ message: 'пользователь с данным id не найден' });
    })
    .catch((err) => res.status(ERROR_INTERNAL).send({ message: err.message }));
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(ERROR_NOT_FOUND).send({ message: 'пользователь с данным id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы невалидные данные при обновлении аватара' });
      } else {
        res.status(ERROR_INTERNAL).send({ message: err.message });
      }
    });
};
