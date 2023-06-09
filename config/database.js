import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AuthSchema from '../model/auth.js'

dotenv.config();

  const database=()=>{

    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("mongdb connected")
    }).catch((err)=>{
        console.log(err);
    })

}

export default database;

