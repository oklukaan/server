import  express   from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import fs from 'fs';
import fetch, { Headers } from "node-fetch"
import { Configuration,OpenAIApi } from "openai";


import  database from './config/database.js'

import {router} from './routes/routes.js'

database();

// const headers = new Headers()
//  const ourPassword = "Nu2d tlxz aEXo eAEj 11Kv CVec"
//  const ourUsername = "admin"


//  headers.set("Content-Type", "application/json")
//  headers.set("Authorization", "Basic " + Buffer.from(`${ourUsername}:${ourPassword}`).toString("base64"))





dotenv.config();

const configuration=new Configuration({
    apiKey:"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",
}); 

const openai=new OpenAIApi(configuration);

const app=express();



app.use(express.json());
app.use(cors());


  
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

app.use('/',router)

app.get('/',async(req,res)=>{

    res.status(200).send({
        message:'hello from server',
        
    });


    
});

// app.post('/melik',async(req,res)=>{

//     try {
       
//         const { email } = req.body;
//   const user = await AuthSchema.findOne({ email: email});
//   const ourUsername = user.username
//   console.log(user);
//   const ourPassword = "Nu2d tlxz aEXo eAEj 11Kv CVec";
//   const headers = new Headers();
//   headers.set("Content-Type", "application/json");
//   headers.set("Authorization", "Basic " + Buffer.from(`${ourUsername}:${ourPassword}`).toString("base64"));
  
//   const res = await fetch("http://localhost/wordpress/wp-json/wp/v2/posts", {
//     method: "POST",
//     headers: headers,
//     body: JSON.stringify({ title: "Hello from kaan", content: `<!-- wp:paragraph -->Hebele hübele<!-- /wp:paragraph -->`, status: "draft" })
//   }); 
//     } catch (error) {
//         console.log(error.message)
//     }
    
//       res.status(200).send({succes:true,msg:'okay'})
      
// })


app.post('/', async(req,res)=>{

    try {
        
        
        const prompt=req.body.prompt;
        const  response=await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0, // Higher values means the model will take more risks.
            max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p: 1, // alternative to sampling with temperature, called nucleus sampling
            frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0, // Number between -2.0 and 2.0. Positive va

        });
    
        const separator = /[\n]+/; 
        const myData=response.data.choices[0].text.split(separator);

        let myResponse=[];
        for(let i=1;i <= myData.length-1;i++){

      
                let response=await openai.createCompletion({
                model: "text-davinci-003",
                prompt: myData[i]+'hakkında sayfa yazarmısın',
                temperature: 0, // Higher values means the model will take more risks.
                max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
                top_p: 1, // alternative to sampling with temperature, called nucleus sampling
                frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
                presence_penalty: 0, // Number between -2.0 and 2.0. Positive va
    
            });
            
            myResponse.push(response.data.choices[0].text)
        }

        

   
        
        res.status(200).send({
            //kot:myResponse.data.choices[0].text,
            aray:myResponse.map(element=>element.replace('ız','')),
            bot:response.data.choices[0].text,
            sot:myData,
        
            
        })

        //  const content=response.data.choices[0].text;
        //  fetch("http://localhost/wordpress/wp-json/wp/v2/posts", {
        //     method: "POST",
        //     headers: headers,
        //     body: JSON.stringify({ title: "Hello from kaan", content: `<!-- wp:paragraph -->${content} ${myResponse.map(element=>element.replace('ız',''))}<!-- /wp:paragraph -->`, status: "draft" })
        //   });
    
    

        fs.appendFile('index.php',content,err=>{
        if(err) return console.log(err)
        });
    }catch (error) {
        console.log(error);
        res.status(500).send({error})
        
    }
})


app.listen(5000,()=>{
    console.log('server is running');
})
