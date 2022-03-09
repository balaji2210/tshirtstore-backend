const mongoose=require('mongoose')


const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
        uinque:true,
        maxlenght:32
    }
},{timestamps:true})


module.exports=mongoose.model("Category",categorySchema);