require('dotenv').config()

const express=require("express")
const cors=require('cors')
const cookieParser=require('cookie-parser')
const mongoose=require('mongoose')
const app=express()
//MyRoutes
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
const categoryRoutes=require('./routes/category')
const productRoutes=require('./routes/product')
const stripeRoutes=require('./routes/stripepayment')
const paymentBRoutes=require('./routes/paymentB')
//DBconnection
mongoose.connect(process.env.DB,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true})
.then(()=>{
    console.log("DB CONNECTED")
})




//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser( ))


//myRoutes
app.use(authRoutes)
app.use(userRoutes)
app.use(categoryRoutes)
app.use(productRoutes)
app.use(stripeRoutes)
app.use(paymentBRoutes)




















app.listen(process.env.PORT||5000,()=>{
    console.log("server is running on port 5000")
})
