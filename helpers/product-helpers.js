var db=require('../config/connection')
var collection=require('../config/collections')
const { ObjectId } = require('mongodb');
var objectId=require('mongodb').ObjectId
module.exports={
    addProduct:(product,callback)=>{
        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            
            callback(data.insertedId)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
},
deleteProduct:(prodId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:new ObjectId(prodId)}).then((response)=>{
            console.log(response);
            resolve(response)
        })
    })
},
getProductDetails:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new objectId(proId)}).then((product)=>{
            resolve(product)
        })
    })
},
updateProduct:(proId,proDetails)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new objectId(proId)},{
            $set:{
                Name:proDetails.Name,
                Description:proDetails.Description,
                Price:proDetails.price,
                Category:proDetails.Category
            }
        }).then((response)=>{
            resolve()
        })
    })
}
}