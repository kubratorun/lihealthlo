const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const Category = require('../models/Category')
const User = require('../models/User')

//express.router bir middle ware

router.get('/',(req,res) => {
  console.log(req.session)
    res.render('site/index')
})
router.get('/about',(req,res) => {
  res.render('site/about',)
})


/* router.get('/admin',(req,res) => {
  res.render('admin/index')
}) */


router.get('/blog',(req,res) => {

  const postPerPage = 4
  const page= req.query.page || 1


 //veritabanından bütün postları almak için  (.) ->promise yazdık
    Post.find({}).populate({path:'author', model: User}).sort({$natural:-1}) 
      .skip((postPerPage * page) - postPerPage)
      .limit(postPerPage)
      .then(posts =>{ 


        //postları toplıycaz

        Post.countDocuments().then(postCount =>{

      //burada bir değişiklik yapıcaz kategoride kaç yane post sayısı old. göstermek için -----Category.find({})----- değil aggregate kullanıcaz

      Category.aggregate([{


        //mongodb 'deki posts db'de category şeklinde alanımız var değilmi ?(evet) ,peki buradaki category alanı nere ile ilişkili? ( categories db'deki id ile ilişkili) 
        //bu ilişkiden faydalanarak lookup değişkeni yazıyoruz 
        //from: 'posts' YANI ilişkili olan yeri söylüyoruz
        //daha sonra localField:'_id' diyerek  categories'deki id 'yi belirtiyoruz AKLINDA TUT BU ID DİYORUZ
        // foreign Field dediği şey ise yukarıda aklında tuttuğu id nere ile ilişkileniyor  postsdb deki """category""""" ile 
        //sonra bunu ne olarak almasını istiyoruz as: 'posts' olarak diyoruz
        //bu KISIMA KADAR birbirleriyle ilişkili olan verileri aldık 


        $lookup:{
          from: 'posts',
          localField: '_id',
          foreignField: 'category',
          as:'posts'
        }
      },
      {
        //şimdi bunları $project olarak alıcaz
        //ilk olarak id almak istiyoruz eğer id almak şistemezsek -id:0 yazabilitriz
        $project:{
          _id:1,
          name:1,
          num_of_posts :{$size: '$posts'} //size posts'un size ına eşit olucak diyoruz 
        }

      }

      ]).then(categories => { 
        res.render('site/blog', 
        {posts:posts,
         categories:categories,
         current: parseInt(page),
         pages: Math.ceil(postCount/postPerPage)
        })
    })
  })
})
})


router.get('/contact',(req,res) => {
  res.render('site/contact')
})

/* router.get('/login',(req,res) => {
  res.render('site/login')
}) */


/* router.get('/register',(req,res) => {
  res.render('site/register')
})
 */


module.exports = router