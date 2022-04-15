const express = require('express');
const mongoose = require('mongoose');
const routersUser = require('./routes/userRoute.js')
// Слушаем 3000 порт
const { PORT = 3000} = process.env;

const app = express();

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(routersUser);

app.use((req, res, next) => {
  req.user = {
    _id: "6259c5963ba250c2f0535983"
  };

  next();
})