var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/admin-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let superadmin=req.session.admin
console.log(superadmin);
productHelpers.getAllProducts().then((products)=>{

  res.render('admin/view-products',{admin:true,products,superadmin})
})

});

router.get('/admin-login',(req,res)=>{
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if(req.session.logedIn){
    res.redirect('/admin')
  }else{

    res.render('admin/admin-login')
  }
})

router.get('/admin-signup',(req,res)=>{
  res.render('admin/admin-signup')
})
router.post('/admin-signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
  })
})

router.post('/admin-login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if (response.status) {
      req.session.logedIn=true
      req.session.admin=response.admin
      res.redirect('/admin')
    }else{
      res.redirect('/admin/admin-login')
    }
  })
})

router.get('/add-product',function(req,res){
  res.render('admin/add-product',{admin:true})
});
router.post('/add-product',(req,res)=>{
console.log(req.body);
console.log(req.files.Image)
productHelper.addProduct(req.body,(id)=>{
  let image=req.files.Image
  console.log(id);
  image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
    if(!err){
      res.render("admin/add-product")
    }else{
      console.log(err);
    }

  })
 
})
})

router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})

router.get('/edit-product/:id',async(req,res)=>{
let product=await productHelpers.getProductDetails(req.params.id)
console.log(product);
res.render("admin/edit-product",{admin:true,product})
})

router.post('/edit-product/:id',(req,res)=>{
console.log(req.params.id);
let id=req.params.id
productHelpers.updateProduct(req.params.id,req.body).then(()=>{
  res.redirect('/admin')
  if(req?.files?.Image){
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg')
  }
})
})


module.exports = router;