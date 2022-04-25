const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routersUser = require('./routes/userRoute');
const routersCard = require('./routes/cardRoute');
const { login, createUser } = require('./controllers/userController');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');
const {
  signUpValidation,
  signInValidation,
} = require('./middlewares/validations');

const { PORT = 3000 } = process.env;
const app = express();
// подключение к бд
mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
// подключаем обработку приходящих данных
app.use(express.json());
// подключаем обработку куки, все куки лежат в req.cookie
app.use(cookieParser());

app.post('/signin', signInValidation, login);
app.post('/signup', signUpValidation, createUser);

// middleware для проверки авторизаци пользователя
app.use(auth);
// роуты которым нужна авторизация
app.use(routersUser);
app.use(routersCard);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(errorHandler);
