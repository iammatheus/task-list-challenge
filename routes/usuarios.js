const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/registro', (req, res) => {
  res.render('registro')
})

router.post('/login', (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/tasks",
    failureRedirect: "/usuarios/login",
    failureFlash: true
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('successMsg', 'Deslogado com sucesso!')
  res.redirect('/')
})

module.exports = router