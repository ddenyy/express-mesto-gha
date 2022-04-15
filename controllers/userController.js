const user = require('../models/user');
const User = require('../models/user');


//get запрос на всех пользователей
module.exports.getUser = (req, res) => {
    User.find({})
        .then(users => res.status(200).send({data: users}))
        .catch(err => res.status(500).send({message: err.message}))
}

//get запрос на конкретного пользователя по _id
module.exports.getUserById = (req, res) => {
    User.findById(req.params.userId)
        .then((user) => res.status(200).send({data: user}))
        .catch(err => res.status(500).send({message: err.message}))
}       

module.exports.createUser = (req, res) => {
    const {name, about, avatar} = req.body;

    user.create({name, about, avatar})
        .then((users) => res.send({data: users}))
        .catch((err) => res.status(500).send({err: err.message}))
}