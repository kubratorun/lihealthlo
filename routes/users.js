const express = require('express')
const router = express.Router()
const User = require('../models/User')
const path = require('path')



router.get('/register',(req,res) => {
    res.render('site/register')
  })


  router.post('/register', (req,res) => {
      User.create(req.body,  (error, user) => {

            req.session.sessionFlash = {
            type: 'alert alert-success',
            message: 'Kullanıcı başarılı  bir şekilde oluşturuldu '
            }
  
          res.redirect('/users/login')
      })
  })

  router.get('/login',(req,res) => {
    res.render('site/login')
  })
  



  //girilen email ve psw doğrulunu kontrol ediyoruz
  router.post('/login',(req,res) => {
      //email ve psw body'den geln email ve psw eşit olması lazım
    const {email, password} = req.body

     //bu body'den gelen email psw veri tabanında olan kullanıcı user ve psw eşlemesi lazım

     User.findOne({email} , (error, user) =>{

        //email eşleştiyse şimdi psw bakıcaz
        if(user){
            if(user.password == password) { //yani body'de deki password user.password db ye eşit olacak

                //user SESSİON
                req.session.userId = user._id
                res.redirect('/')

            } else {
                res.redirect('/users/login')

            }
        } else {

            res.redirect('/users/register')

        }
     })

  })



  router.get('/logout', (req,res)=>{
      req.session.destroy(() =>{
          res.redirect ('/')
      })
  })

  module.exports = router
  