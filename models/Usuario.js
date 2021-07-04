const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema ({
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

mongoose.model('usuarios', Usuario)