const mongoose=require('mongoose');
const URI=process.env.MONGOOSE_URI;
const connect=async()=>{
try {
        await mongoose.connect(URI)
        console.log("Connected to MongoDB Atlas");
    }
 catch (error) {
    console.log('Eroor in connection: ',error)
}
}



const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  sentiment: { type: String, enum: ["positive", "neutral", "negative"] },
  publishedBy: { type: String }, // source name
  publishedAt: { type: Date },   // when the news was published
  url: { type: String, unique: true }, // link to the article
  createdAt: { type: Date, default: Date.now } // when we stored it
});
newsSchema.index({ publishedAt: -1 });
const NEWS =  mongoose.model("News", newsSchema);
module.exports= NEWS