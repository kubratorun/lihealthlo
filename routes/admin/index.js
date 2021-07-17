const express = require('express')
const router = express.Router()
const path = require('path')
const Category = require('../../models/Category')
const Post = require('../../models/Post')
const User = require('../../models/User')


//express.router b ir middle ware


router.get('/',(req,res) => {

    res.render('admin/index')
})

router.get('/categories',(req,res)  => {

    //buradaki sort eklediğimiz categories de -> sıralamayı düzeltiyor . eklediğimiz en son kategoriyi  en başa getiriyor 
     Category.find({}).sort({$natural:-1}).then(categories => {
         res.render('admin/categories', {categories:categories})
     })


})

router.post('/categories',(req,res)  => {

    Category.create(req.body , (error, category )=>{

        if(!error){
            res.redirect('/admin/categories')
        }
    })

})


router.delete('/categories/:id', (req,res) => {

    Category.remove({_id : req.params.id}).then(()=>{
            res.redirect('/admin/categories')


        })
    })



router.get('/posts',(req,res)  => {

    Post.find({}).populate({path:'category', model: Category}).sort({$natural:-1}).then(posts =>{ 

            res.render('admin/posts',{posts:posts}) 
    })
})
  

router.delete('/posts/:id', (req,res) => {

    Post.remove({_id : req.params.id}).then(()=>{
            res.redirect('/admin/posts')


        })
    })
  
    router.get('/posts/edit/:id',(req,res)  => {

        Post.findOne({_id:req.params.id}).then(post =>{
            Category.find({}).then(categories =>{
                res.render('admin/editpost', {post:post, categories:categories})
            })
        })
    
    })

    router.put('/posts/:id',(req,res)=>{
        let post_image = req.files.post_image

        post_image.mv(path.resolve(__dirname , '../../public/img/postimages/', post_image.name))  

        //post update
        Post.findOne({_id:req.params.id}).then(post =>{
        
            post.title=req.body.title
            post.content=req.body.content
            post.date =req.body.date
            post.category=req.body.category
            post.post_image= `/img/postimages/${post_image.name}`
           
            post.save().then(post => {
                res.redirect('/admin/posts')
            })
        
    })
})
 
  module.exports = router
