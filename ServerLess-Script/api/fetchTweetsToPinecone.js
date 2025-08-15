// api/storeTweets.js — Vercel serverless API route (CommonJS)

const { Pinecone } = require("@pinecone-database/pinecone");
const fetch = require("node-fetch"); // Remove if on Node 18+ runtime in Vercel

// Get embeddings from Pinecone's own model (matches 1024 dimensions)
async function getLlamaEmbedding(text) {
    const resp = await fetch("https://api.pinecone.io/embed", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Api-Key": process.env.PINECONE_API_KEY
        },
        body: JSON.stringify({
            model: "llama-text-embed-v2",
            input: text
        })
    });

    if (!resp.ok) {
        throw new Error(`Embedding API error: ${resp.statusText}`);
    }

    const data = await resp.json();
    return data.data[0].values;
}

module.exports = async function handler(req, res) {
    try {
        const keywords = [
            "Finance",
            "Business",
            "Economy",
            "Education",
            "Technology",
            "Health",
            "Science",
            "Geopolitics",
            "Bitcoin"
        ];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];

        // Fetch tweets from Twitter API
        const twitterRes = await fetch(
            `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(keyword)}&max_results=3&tweet.fields=created_at,lang`,
            {
                headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
            }
        );

        const twitterData = await twitterRes.json();
        if (!twitterData.data) {
            return res.status(200).json({ message: "No tweets found." });
        }

        // Init Pinecone SDK
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });

        // Connect to your existing serverless index (name + host from .env)
        const index = pc.index("news-api",`https://news-api-hn74z2y.svc.aped-4627-b74a.pinecone.io`);

        // Store each tweet in Pinecone
        for (let tweet of twitterData.data) {
            try {
                const vector = await getLlamaEmbedding(tweet.text);

                await index.upsert([
                    {
                        id: tweet.id,
                        values: vector,
                        metadata: {
                            text: tweet.text,
                            keyword,
                            created_at: tweet.created_at,
                            lang: tweet.lang,
                            url: `https://twitter.com/i/web/status/${tweet.id}`
                        }
                    }
                ]);

                console.log(`Stored tweet: ${tweet.id}`);
            } catch (err) {
                console.error(`Error embedding tweet ${tweet.id}:`, err.message);
            }
        }

        res.status(200).json({
            message: `Stored ${twitterData.data.length} tweets for keyword: ${keyword}`
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};
