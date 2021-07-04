// LOADING MODULES
require('dotenv').config()
const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const admin = require('./routes/admin')
const usuarios = require('./routes/usuarios')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')

const session = require('express-session')
const flash = require('connect-flash')

const passport = require('passport')
require('./config/auth')(passport)

//Sessão
app.use(session({
   secret: "tasklist",
   resave: true,
   saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Middleware
app.use((req, res, next) => {
   //variaveis globais
   res.locals.successMsg = req.flash("successMsg")
   res.locals.errorMsg = req.flash("errorMsg")
   res.locals.error = req.flash('error')
   res.locals.user = req.user || null
   next()
})

// CONFIGURATION - Mongoose
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URL)
.then(() =>{
   console.log('Conectado ao mongo');
}).catch((err) => {
   console.log('Erro ao se conectar: ' + err)
})

/* body-parser */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//cors
app.use(cors())

/* handlebars */
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// PUBLIC
app.use(express.static(path.join(__dirname, 'public')))

// ROUTES
app.use('/', admin)
app.use('/usuarios', usuarios)

// OTHERS
const PORT = process.env.PORT || 8080
app.listen(PORT) 