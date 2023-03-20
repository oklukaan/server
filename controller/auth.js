import AuthSchema from '../model/auth.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'



const register =async(req,res) =>{

    try {
        const {username,email,password,wpdata}=req.body;

        const user=await AuthSchema.findOne({email})

        if(user){
            return res.status(500).json({
                mgs:'böylebir kullanıcı var'
            })
        }
        if(password.length <6){
            return res.status(500).json({msg:"Sifreniz 6 karakterden küçük olmamalı"})
        }

        const passwordHas=await  bcrypt.hash(password,12);

        if(!isEmail(email)){
            return res.status(501).json({msg:"email formatı dışında girdiniz"})
        }

        const newUser=await AuthSchema.create({username,email,password:passwordHas,wpdata})

        const token=jwt.sign({id:newUser._id},"SECRET_KEY",{ expiresIn:'1h' })

        res.status(201).json({
            status:"OK",
            newUser,
            token
        })
        
    } catch (error) {
         return res.status(500).json({msg:error.message})
        
    }
}

const login =async(req,res) =>{

    try {

        const {email,password}=req.body
        const user=await AuthSchema.findOne({email:email})

        if(!user){
            return res.status(500).json({msg:"'Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı"})
        }

        const passwordCompare=await bcrypt.compare(password,user.password)
        
        if(!passwordCompare){
            return res.status(401).json({msg:"Girilen şifre yanlış"})
        }

        const token=jwt.sign({id:user._id},"SECRET_KEY",{ expiresIn:'1h' })

        res.status(201).json({
            status:"OK",
            user,
            token
       
        })
    } catch (error) {
        return res.status(500).json({msg:error.message })
    }
}

const update =async(req,res) =>{
try {
    const user_id=req.body.user_id;
    const wpdata=req.body.wpdata;
    const data=await AuthSchema.findOne({_id:user_id});
    if(data){
        const user =await AuthSchema.findByIdAndUpdate({_id:user_id},{$set:{
            wpdata:wpdata
        }});

        res.status(200).send({succes:true,msg:'okay oldu'})

    }else{
        res.status(200).send({succes:false,msg:'user id not found'});
    }
    
} catch (error) {
    res.status(400).send(error.message);
}
  
}


function isEmail(emailAdress){
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (emailAdress.match(regex)) 
    return true; 

   else 
    return false; 
}

export {register,login,update}