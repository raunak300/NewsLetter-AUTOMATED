const { response } = require('express');
const NEWS=require('../Model/News.js')
const API1=process.env.API1;
const axios = require("axios");


// const fillNews = async (req, res) => {
//   try {
//     const {text}=req.body;
//     console.log("Anaylse Text:",text);
//     const fastapiResponse= await axios.post(" http://127.0.0.1:8000/predict", {text});
//     console.log("FastAPI Response:", fastapiResponse.data);
//     res.ststus(200).json({ 
//       message: "Prediction done",
//       fastapiResult: fastapiResponse.data 
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

const sendNews=async(req,res)=>{
    try {
        const page=parseInt(req.query.page) || 1;
        const limit=5;
        const skip=(page-1)*limit;
        const totalNews=await NEWS.countDocuments();
        const pagesNo=Math.ceil(totalNews/limit);
        const news=await NEWS.find().sort({publishedAt:-1}).skip(skip).limit(limit);
        res.json({
            news,pagesNo,totalNews
        })
        
    } catch (error) {
        console.log("Eroor in fetching news: ",error)
        res.status(500).json({ error: "Error fetching news" });

    }
}

const getanalysis = async (req, res) => {

  try {
    const {text}=req.body;
    console.log("Anaylse Text:",text);
    const fastapiResponse= await axios.post("https://newsletter-automated-1.onrender.com/predict", {text});
    console.log("FastAPI Response:", fastapiResponse.data);
    res.status(200).json({ 
      message: "Prediction done",
      fastapiResult: fastapiResponse.data 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {  sendNews,getanalysis };