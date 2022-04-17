const User = require('../models/user');

// get запрос на всех пользователей
module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// get запрос на конкретного пользователя по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ err: err.message }));
};

module.exports.updateUserData = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(400).send({ message: 'пользователь с данным id не найден' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(400).send({ message: 'пользователь с данным id не найден' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
