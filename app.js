const express = require('express');
const mongoose = require('mongoose');
const routersUser = require('./routes/userRoute');
const routersCard = require('./routes/cardRoute');

const { PORT = 3000 } = process.env;
const { ERROR_NOT_FOUND } = require('./constants');

const app = express();

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');
  } catch (err) {
    console.log(err);
  }
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6259c5963ba250c2f0535983',
  };
  next();
});

app.use(routersUser);

app.use(routersCard);

app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: `такой страницы ${req.baseUrl} нет` });
});

main();
