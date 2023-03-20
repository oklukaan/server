import  express  from "express";
import {register,login,update} from '../controller/auth.js'


const router=express.Router();

    router.post('/register',register)
    router.post('/login',login)
    router.post('/update',update)

   

export {router}
