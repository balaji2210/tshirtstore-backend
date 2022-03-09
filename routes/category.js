const express=require('express')
const router=express.Router()

const { isSignedIn, isAuthenticated, isAdmin }=require('../controllers/auth')
const { getCategoryById, createCategory,getAllCategories,updateCategory,removeCategory,getCategory } = require('../controllers/category')
const {getUserById}=require('../controllers/user')

router.param("userId",getUserById)
router.param("categoryId",getCategoryById)

//actual routes
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory)
router.get("/categories",getAllCategories)
router.put('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,updateCategory)
router.delete('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,removeCategory)
router.get('/category/:categoryId',getCategory)






module.exports=router;