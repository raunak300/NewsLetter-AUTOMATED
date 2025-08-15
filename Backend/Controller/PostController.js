const { response } = require('express');
const NEWS=require('../Model/News.js')
const API1=process.env.API1;
const axios = require("axios");


const fillNews = async (req, res) => {
  try {
    const apires = await fetch(`https://newsapi.org/v2/everything?q=Finance&pageSize=20&apiKey=${API1}`);
    const data1 = await apires.json();

    if (!data1.articles) {
      return res.status(400).json({ message: "No articles found" });
    }

    // Loop and save articles
    for (let article of data1.articles) {
      try {
        await NEWS.create({
          title: article.title,
          description: article.description,
          sentiment: null,
          Detail: article.content,
          publishedBy: article.source?.name || "Unknown",
          publishedAt: new Date(article.publishedAt),
          url: article.url
        });
      } catch (err) {
        // Ignore duplicate URL errors
        if (err.code !== 11000) {
          console.error("Error saving article:", err);
        }
      }
    }

    res.json({ message: "News saved successfully", count: data1.articles.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

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
  const { text } = req.body;

  try {
    const url = "https://api-inference.huggingface.co/models/Pulk17/Fake-News-Detection";
    console.log(HF_API_KEY)
    console.log("Text to analyze:", text);
    const headers = {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`, // Store your key in .env
      "Content-Type": "application/json"
    };

    const payload = { inputs: text }; // "inputs" is the correct field name

    const response = await axios.post(url, payload, { headers });
    console.log("Response from model:", response.data);
    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Model inference error:", error.message);
    return res.status(500).json({ error: "Problem in running model" });
  }
};



module.exports = { fillNews, sendNews,getanalysis };