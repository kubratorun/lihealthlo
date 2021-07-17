const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const path = require('path')
const Category = require('../models/Category')
const User = require('../models/User')



//express.router bir middle ware


router.get('/new',(req,res) => {
  if(!req.session.userId){

   res.redirect('users/login')

  }
    Category.find({}).then(categories=>{ 
      res.render('site/addpost',{categories:categories})
    })
  })
 //site-sidebar search işlemi için 

 function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", (req, res) => {
  if (req.query.look) {
     const regex = new RegExp(escapeRegex(req.query.look), 'gi');
     Post.find({ "title": regex }).populate({path:'author', model: User}).sort({$natural:-1}).then(posts => {
      Category.aggregate([{
 

        $lookup:{
          from: 'posts',
          localField: '_id',
          foreignField: 'category',
          as:'posts'
        }
      },
      {
     
        $project:{
          _id:1,
          name:1,
          num_of_posts :{$size: '$posts'} 
        }

      }

      ]).then(categories=>{
      
      res.render('site/blog',
       {posts:posts,
        categories:categories})

     })

    });
  }
})

 
  router.get('/category/:categoryId', (req, res) => {
    Post.find({category:req.params.categoryId}).populate({path:'category', model:Category}).populate({path:'author', model: User}).then(posts => {

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

      ]).then(categories=>{
        res.render('site/blog',{posts:posts, categories:categories})
      })
    }) 


  })



  router.get('/:id',(req,res) => {
      Post.findById(req.params.id).populate({path:'author', model: User}).then(post =>{
        
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
          Post.find({}).populate({path:'author', model: User}).sort({$natural:-1}).then(posts =>{ 
            //tekil post sayfasında yer alanlar
            res.render('site/post', {post:post, categories:categories, posts:posts})
          })

      
      })
 
  })
})



  router.post('/test',(req, res) => {

  let post_image = req.files.post_image

    post_image.mv(path.resolve(__dirname , '../public/img/postimages/', post_image.name))  

  Post.create({
        ...req.body,
        post_image:`/img/postimages/${post_image.name}`,
        author : req.session.userId 
  }, )
  

req.session.sessionFlash = {
  type: 'alert alert-success',
  message: 'Postunuz başarılı bir şekilde oluşturuldu '
}


res.redirect('/blog')
  })
  

module.exports = router