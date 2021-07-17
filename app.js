const path = require('path')
const express = require('express')
const Handlebars = require('handlebars')
const exphbs  = require('express-handlebars')
const helpers = require('handlebars-helpers')
//const hbs = require('express-hbs');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const port = process.env.PORT || 3000
const hostname = '127.0.0.1'
//const crypto = require('crypto')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//const multer = require ('multer')
//const GridFsStorage = require('multer-gridfd-storage')
//const Grid = require ('gridfs-stream')

const methodOverride = require('method-override')
const fileUpload = require('express-fileupload')
const {generateDate, limit, truncate, paginate } = require('./helpers/hbs')

const moment = require('moment')
const expressSession =require('express-session')
/* const passport=require('passpo rt')
const localStrategy = ('passport-local').Strategy
const bcrypt= require('bcrypt') */
const MongoStore = require('connect-mongo');




mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://kubratorun:084652Kt.@kubratorun.gpwfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
})

//const mongoStore = connectMongo(expressSession)
app.use(expressSession({
  secret:"verygoodsecret",
  resave: false,
  saveUninitialized: true,
  //cookie : { secure:false},
  store: MongoStore.create({ mongoUrl:'mongodb://localhost:27017' })
}))




app.use(fileUpload())

app.use(express.static('public'))
app.use(methodOverride('_method'))

//handlebars helpers 

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: { 
    generateDate: generateDate,
    limit: limit,
    truncate:truncate,
    paginate:paginate
  }
});

app.engine('handlebars',hbs.engine)
app.set('view engine', 'handlebars')
//template engine
/* 
app.engine('handlebars', exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
      generateDate: (date, format) => {
          return moment(date).format(format)
      }
  }
}))
 */



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/


 /*Linklerin düzenlenmesi aşama 1 (login iken login linki gözükmiycek yada login değilken addpost gözikmiycek gibibiiiii:))))))))*/ 
       //DISPLAY LINK MIDDLEWARE

        app.use((req, res, next)=>{
          const {userId} = req.session
          if(userId){
            res.locals = {
              displayLink: true
            }
          }
            else{
              res.locals ={
                displayLink:false
              }
          }
          next()
        })
        //flash message middleware
app.use((req,res,next)=>{
  res.locals.sessionFlash = req.session.sessionFlash
  delete req.session.sessionFlash
  next()
})



const main = require('./routes/main')
const posts = require('./routes/posts')
const users = require('./routes/users')
const admin =require('./routes/admin/index')
const contact =require('./routes/contact')

app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)
app.use('/contact', contact)
 


app.listen(port,hostname ,() => {
  console.log(`Server çalışıyor, http://${hostname}:${port}/`)
})
