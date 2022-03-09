const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        maxlenght:32,
        trim:true
    },
    lastname:{
        type:String,
        maxlenght:32,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    userInfo:{
        type:String,
    },
    role:{
        type:Number,
        default:0
    },
    purchases:{
        type:Array,
        default:[]
    }

},{timestamps:true})


module.exports=mongoose.model("User",userSchema);