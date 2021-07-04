const express = require('express')
const router = express.Router()

const passport = require('passport')

router.post('/login', async (req, res, next) => {
  try{
    await passport.authenticate("local", {
      successRedirect: "/tasks",
      failureRedirect: "/",
      failureFlash: true
    })(req, res, next)
  }catch(err){
    next(err)
  }
})

router.get('/logout', (req, res) => {
  try{
    req.logout()
    req.flash('successMsg', 'Deslogado com sucesso!')
    res.redirect('/')
  }catch(err){
    console.log('Erro ao deslogar: ' + err);
  }
  
})

module.exports = router