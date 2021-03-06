const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema

const productSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
        maxlenght:2000
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    category:{ 
        type:ObjectId,
        ref:"Category",
        required:true
    },
    stock:{
        type:Number,
        default:0
    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,
        contentType:String
    }

},{timestamps:true})


module.exports=mongoose.model('Product',productSchema)