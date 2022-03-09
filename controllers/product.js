const Product=require('../models/product')
const formidable=require('formidable')
const _=require('lodash')
const fs=require('fs')

exports.getProductId=(req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({error:"No product Found"})
        }
        req.product=product;
        next()
    })
}


exports.createProduct=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;

    form.parse(req,(err,fileds,file)=>{
        if(err){
            return res.status(400).json({error:"problem with Image"})
        }
        //destructure fileds
        const {name,description,price,stock,category,sold}=fileds

        if(!name||!description||!price||!category||!stock){
            return res.status(400).json({error:"All fileds Are Required"})
        }

        //TODO: restriction on fields
        
        let product=new Product(fileds)
        //handel file here
        if(file.photo){
            if(file.photo.size>3000000){
                return  res.status(400).json({error:"File Size too big"})
            }
            product.photo.data=fs.readFileSync(file.photo.path)
            product.photo.contentType=file.photo.type
        }
        //save to DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({error:"Product Not Saved"})
            }
            res.json(product);
        })

    })
}

exports.getProduct=(req,res)=>{

    req.product.photo=undefined;

    return res.json(req.product)
}

//photo middle ware
exports.photo=(req,res,next)=>{
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    
    next()
}

exports.updateProduct=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;

    form.parse(req,(err,fileds,file)=>{
        if(err){
            return res.status(400).json({error:"problem with Image"})
        }
        //destructure fileds
       
        //TODO: restriction on fields
        //updation code
        let product=req.product;
        product=_.extend(product,fileds)
        //handel file here
        if(file.photo){
            if(file.photo.size>3000000){
                return  res.status(400).json({error:"File Size too big"})
            }
            product.photo.data=fs.readFileSync(file.photo.path)
            product.photo.contentType=file.photo.type
        }
        //save to DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({error:"Product Updation failed"})
            }
            res.json(product);
        })

    })
}

exports.removeProduct=(req,res)=>{
    const product=req.product;
    product.remove((err,product)=>{
        if(err){
            return res.status(400).json({error:"Product deletion Failed"})
        }
        res.json({message:"Deleted Product"})
    })
}


exports.getAllProducts=(req,res)=>{
    let limit=req.query.limit ?parseInt(req.query.limit) :8;
    let sortBy=req.query.sortBy ?req.query.sortBy :"_id";
    Product.find()
    .select('-photo')
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({error:"NO products found"})
        }
        res.json(products)
    })
}


exports.updateStock=(req,res,next)=>{

    let myOps=req.body.order.products.map(prodcut=>{
        return {
            updateOne:{
                filter:{_id:product._id},
                update:{$inc:{stock:-product.count,sold:+prodcut.count}}
            }
        }
    })

    Product.bulkWrite(myOps,{},(err,products)=>{
        if(err){
            return res.status(400).json({error:"Bulk ops Failed"})
        }
        next()
    })
    
}


exports.getAllUniqueCategories=(req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({error:"NO Category Found"})
        }
        res.json(category)
    })
}