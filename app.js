//Include
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const hostname = '127.0.0.1'
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
/* Helpers */
const pagination = require('./helpers/pagination').pagination
const truncate = require('./helpers/truncate').truncate
const limit = require('./helpers/limit').limit
const generateDate = require('./helpers/generateDate').generateDate
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const methodOverride = require('method-override')
//Database
mongoose.connect('mongodb://127.0.0.1/nodejsblog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
const MongoStore = connectMongo(expressSession)
//Express Session
app.use(expressSession({
  secret: 'hakk', // güvenlik anahtarı
  resave: false, // session kaydet
  saveUninitialized: true, // 
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//File Upload (Post Image)
app.use(fileUpload({
  safeFileNames: true
}))
//Static Files
app.use(express.static('public'))
//Method Override
app.use(methodOverride('_method'))
//Handlebars Helpers
const hbs = exphbs.create({
  helpers: {
    generateDate: generateDate,
    limit: limit,
    truncate: truncate,
    pagination: pagination

  }
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Display Link Middleware
app.use((req, res, next) => {
  const { userId } = req.session
  const { isAdmin } = req.session

  if (userId && isAdmin) {
    res.locals = {
      displayLink: true,
      adminLink:true
    }
  }else if(userId && (isAdmin==0)){
    res.locals = {
      displayLink: true,
      adminLink:false
    }
  }
  else {
    res.locals = {
      displayLink: false
    }
  }
  next()
})
// Flash Message Middleware
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash
  delete req.session.sessionFlash
  next()
})
//Routes
const main = require('./routes/main')
const posts = require('./routes/posts')
const users = require('./routes/users')
const admin = require('./routes/admin/index')

app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)
//Server Create
app.listen(port, hostname, () => {
  console.log(`Server Adress http://${hostname}:${port}`)
})


