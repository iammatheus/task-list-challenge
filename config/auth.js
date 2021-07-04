const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model do usuário
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')


module.exports = function(passport) {
  passport.use(
    new localStrategy({ usernameField: 'userName', passwordField: 'password'}, 
    (userName, password, done) => {
      Usuario.findOne({ userName })
      .then((usuario) => {
        if(!usuario){
          return done(null, false, { message: 'Conta inexistente!' })
        }

        bcrypt.compare(password, usuario.password, (error, batem) => {
          if(batem){
            return done(null, usuario)
          }else{
            return done(null, false, { message: 'Senha incorreta!' })
          }
        })
        
      })
  }))

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id)
  })

  passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, usuario) => {
      done(err, usuario)
    })
  })

}