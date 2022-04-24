const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
// get запрос на всех пользователей
module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

// get запрос на конкретного пользователя по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('пользователь с таким id не найден'));
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next);
};


module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new NotFoundError('Email или password не могут быть пустыми'));
  }
  return bcrypt.hash(password, 10)
    .then((hash) => {
      return User.create({ name: name, about: about, avatar: avatar, email: email, password: hash, })
        .then(() => res.status(200).send({ data: { name, about, avatar, email } }))
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
       return next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
       return next(new ConflictError('Такой пользователь уже существует'));
      } else {
       return next(err);
      }
    })
};

module.exports.updateUserData = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('пользователь с таким id не найден'));
      } else {
        return res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new NotFoundError('пользователь с таким id не найден'));
      } else {
        return next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('пользователь с таким id не найден'));
      } else {
        return res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      } else {
        return next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch(next)
}


// проверка логина и пароля
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 604800000,  //7 дней
      });
      res.send({ message: 'токен находится в cookie' });
    })
    .catch(() => {
      return next(new UnauthorizedError('Неправильная почта или пароль'))
    });
}