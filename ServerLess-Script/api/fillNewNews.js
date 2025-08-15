const mongoose = require('mongoose');
const NEWS = require('../../Backend/Model/News.js');
const dotenv = require('dotenv');
dotenv.config();
const API1 = process.env.API1;

async function fetchAndStoreNews() {
  try {
    const apires = await fetch(`https://newsapi.org/v2/everything?q=Finance&pageSize=20&apiKey=${API1}`);
    const data1 = await apires.json();

    if (!data1.articles) {
      console.log("No new articles found.");
      return;
    }

    await mongoose.connect(process.env.MONGOOSE_URI); // MongoDB se connect karo

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
        if (err.code !== 11000) { // duplicate key error
          console.error("Error saving article:", err);
        }
      }
    }
    console.log(`Successfully saved ${data1.articles.length} articles.`);
  } catch (error) {
    console.error("Automation job failed:", error);
  } finally {
    await mongoose.disconnect(); // Task ke baad connection band kar do
  }
}

// Call the function
fetchAndStoreNews();