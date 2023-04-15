const {model, Schema } = require('mongoose')

const userShcema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
})

module.exports = model('User', userShcema)