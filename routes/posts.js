//Include
const express  = require('express')
const router = express.Router()
const Post = require('../models/Post')
const urlSlug = require('url-slug')
const path = require('path')
const User = require('../models/User')
const Category = require('../models/Category')
//Add Post Page! (GET)
router.get('/new', (req,res) => {
    //if admin control
    if(req.session.isAdmin){
        return Category.find({}).then(categories =>{
            res.render('site/addpost', {categories:categories, active:{addpost:true},pageTitle:"New Post",
        })
        })
    }else {
        res.redirect('/users/login')
    }
})
//Search (GET)
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", (req, res) => {
    if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi')
       Post.find({"title":regex}).populate({path:'author', model:User}).populate({path:'category', model:Category}).sort({$natural:-1}).then(posts =>{
        Category.find({}).then(categories =>{
            res.render('site/blog', {posts:posts, categories:categories, active:{blog:true}})
        })
    })
    }
})
//Category Post List (GET)
router.get('/category/:categoryId', (req, res)=>{
    Post.find({category:req.params.categoryId}).populate({path:'author', model:User}).populate({path:'category', model:Category}).sort({$natural:-1}).then(posts =>{
        Category.find({}).then(categories =>{
            res.render('site/blog', {posts:posts, categories:categories, active:{blog:true}})
        })
    })
})
//Single Post
router.get('/:slugTitle', (req,res) => {
    Post.findOne({slugTitle:req.params.slugTitle}).populate({path:'author', model:User}).populate({path:'category', model:Category}).then(post=>{
        Category.find({}).then(categories =>{
            Post.find({}).populate({path:'author', model:User}).populate({path:'category', model:Category}).sort({$natural:-1}).then(posts =>{
                res.render('site/post', {post:post, categories:categories, posts:posts})
            })
        })
    })
})
//Add Post (POST)
router.post('/add', (req,res) => {
    var uniqueSlug=urlSlug(req.body.title, {
        separator: '_',
        transformer: urlSlug.transformers.lowercase
      })
    //Slugify Title
    function slugify(countSlug) {
        Post.findOne({slugTitle:uniqueSlug}, (err,post)=>{
            if (post===null) {
                req.body.slugTitle=uniqueSlug
                if (req.files!=null){
                    let post_image = req.files.post_image
                    post_image.name= (uniqueSlug).slice(-5)
                    post_image.mv(path.resolve(__dirname, '../public/img/postimages', post_image.name))
                    var imagePath = `/img/postimages/${post_image.name}`
                }
                else{
                    var imagePath = null
                }


                Post.create({
                    ...req.body,
                    post_image: imagePath,
                    author : req.session.userId,
                    category:req.body.category,
                })
            } else {
                countSlug ++
                uniqueSlug += "_" + String(countSlug)
                slugify(countSlug)
            }
        })
    }
    var countSlug = 0
    slugify(countSlug)
    req.session.sessionFlash = {
        type: 'alert alert-success',
        message: 'Successful...'
    }
    res.redirect('/blog')
})
//Module Exports
module.exports = router