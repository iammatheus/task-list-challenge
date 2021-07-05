const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model do usuário
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')


module.exports = async function(passport) {
  await passport.use(
   new localStrategy({ usernameField: 'userName', passwordField: 'password'},
    async (userName, password, done) => {
     await Usuario.findOne({ userName })
      .then((usuario)=> {
        if(!usuario){
          return done(null, false, { message: 'Usuário não cadastrado!' })
        }

        bcrypt.compare(password, usuario.password, (error, batem) => {
          if(batem){
            return done(null, usuario)
          }else{
            return done(null, false, { message: 'Erro ao efetuar login!'})
          }
        })
        
      }).catch(err => {
        console.log('Erro ao logar ' + err);
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