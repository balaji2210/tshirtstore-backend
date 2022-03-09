
const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const expressJwt=require('express-jwt')


exports.signUp=(req,res)=>{

    const {name,email,password}=req.body
    bcrypt.hash(password,12,(err,hashPassword)=>{
        if(hashPassword){
            const user=new User({
                name,
                email,
                password:hashPassword
            })
            user.save((err,user)=>{
                if(err){
                    return res.status(400).json({
                        error:"user not saved in DB"
                    })
                }
                user.password=undefined;
               return  res.json(user)
            })
        }
    })

}


exports.signIn=(req,res)=>{
    
    const {email,password}=req.body
    User.findOne({email},(err,user)=>{
        if(err||!user){
            return res.status(400).json({
                error:"NO user Found with email"
            })
        }
        bcrypt.compare(password,user.password,(err,saveduser)=>{
            if(err||!saveduser){
                return res.status(400).json({
                    error:"Wrong email or password"
                })
            }
            //create token
            const token=jwt.sign({_id:user._id},process.env.SECRET)
            //put token in cookie
            res.cookie("token",token,{expire:new Date()+9999})
            //send response to frontend
            const {_id,name,email,role}=user;
            return res.json({token,user:{_id,name,email,role}});
        })
    })
}


//protected routes
exports.isSignedIn=expressJwt({
        secret:process.env.SECRET,
        userProperty:"auth",
        algorithms:['RS256','HS256']
    })


// custom middlewares
exports.isAuthenticated=(req,res,next)=>{
    let check=req.profile && req.auth && req.profile._id==req.auth._id
    if(!check){
        return res.status(403).json({error:"You Should be Authenticated"})
    }
    next()
}


exports.isAdmin=(req,res,next)=>{

    if(req.profile.role==0){
        return res.status(403).json({error:"You are Not Admin"})
    }

    next()
}


