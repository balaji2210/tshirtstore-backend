const Category=require('../models/category')



exports.getCategoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err){
            return res.status(400).json({error:"Category Not found in DB"})
        }
        req.category=category
        next()
    })
}



exports.createCategory=(req,res)=>{
    const category=new Category(req.body);
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({error:"Category Not Sved"})
        }
        return res.json(category)
    })
}


exports.getAllCategories=(req,res)=>{
    Category.find((err,categories)=>{
        if(err){
            return res.status(400).json({error:"No Categories Found"})
        }
        return res.json(categories)
    })
}

exports.updateCategory=(req,res)=>{
    Category.findByIdAndUpdate(
        {_id:req.category._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,category)=>{
            if(err){
                return res.status(400).json({error:"Category Not Updated"})
            }
            res.json(category)
        }
    )
}
exports.removeCategory=(req,res)=>{
    const category=req.category;
    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({error:"Deletion Category Failed"})
        }
        res.json(category)
    })
}


exports.getCategory=(req,res)=>{
    return res.json(req.category)
}