var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session.loggedIn) {
    req.session.loggedIn = true
  let user=req.session.user
  productHelpers.getAllProducts().then((products)=>{

      res.render('user/view-product',{products,user})
    })
  }else{
    res.redirect('/login')
    
  }
})
router.get('/login',(req,res)=>{
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
 if (req.session.loggedIn) {
  res.redirect('/')
 }else
   res.render('user/login',{"LoginErr":req.session.loginErr})
   req.session.loginErr=false
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    res.redirect('/login')
  })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
   if (response.status) {
    req.session.loggedIn=true
    req.session.user=response.user
    res.redirect('/')
   }else{
    req.session.loginErr="Inavlid username or Password"
    res.redirect('/login')
   }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})


module.exports = router;
