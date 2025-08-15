// required modules
const mongoose = require('mongoose');
const NEWS = require('../Models/News.js'); // Model file ka sahi path
// Vercel par environment variables code mein apne aap available hote hain
// Isliye dotenv ki zarurat nahi. Variables ko aise hi use karna hai.
const API1 = process.env.API1;
const MONGOOSE_URI = process.env.MONGOOSE_URI;
// Yeh Vercel serverless function ka sahi format hai
module.exports = async (req, res) => {
  try {
    // MongoDB se connect
    await mongoose.connect(MONGOOSE_URI);
    console.log("Connected to MongoDB Atlas");

    // News API ko call karo
    const apires = await fetch(`https://newsapi.org/v2/everything?q=Finance&pageSize=20&apiKey=${API1}`);
    const data1 = await apires.json();

    if (!data1.articles || data1.articles.length === 0) {
      console.log("No new articles found.");
      return res.status(200).json({ message: "No new articles found." });
    }
    // Har article ko database mein save karo
    for (let article of data1.articles) {
      try {
        await NEWS.create({
          title: article.title,
          description: article.description,
          sentiment: null,
          publishedBy: article.source?.name || "Unknown",
          publishedAt: new Date(article.publishedAt),
          url: article.url
        });
      } catch (err) {
        if (err.code !== 11000) { // Duplicate key error ko ignore karo
          console.error("Error saving article:", err);
        }
      }
    }
    console.log(`Successfully saved ${data1.articles.length} articles.`);
    // Successful response bhejo
    res.status(200).json({ message: `Successfully saved ${data1.articles.length} articles.` });
  } catch (error) {
    console.error("Automation job failed:", error);
    // Error response bhejo
    res.status(500).json({ error: "Automation job failed.", details: error.message });
  } finally {
    // Task khatam hone ke baad connection close karo
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};
