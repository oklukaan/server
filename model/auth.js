import mongoose from 'mongoose';

const AuthSchema =new mongoose.Schema({
    username:
    {
        type:String,
        required:true,
        trim:true
    },
    email:
    {
        type:String,
        required:true,
        unique:true    
    },
    password:
    {
        type:String,
        required:true,

    },
    data:
    {
        type:Date,
        default:new Date()
    },
    wpdata:
    {
        type:String,
        required:false,
        unique:true   

    }

})

const Post=mongoose.model('auth',AuthSchema);

export default Post