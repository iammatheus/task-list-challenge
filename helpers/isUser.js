module.exports = {
  isUser: function(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }
    req.flash('errorMsg', 'Faça login!')
    res.redirect('/')
  }
}