const express=require ('express');
const app=express();
const dotenv=require('dotenv')
dotenv.config()

const PORT=process.env.port;

const CORS=require('cors');
app.use(CORS())

const connect=require("./Model/News.js")

const Postroutes=require('./Routes/PostRoutes.js')
app.use('/api',Postroutes);



app.listen(PORT,()=>{
    console.log("Listening on port", PORT);
    
})