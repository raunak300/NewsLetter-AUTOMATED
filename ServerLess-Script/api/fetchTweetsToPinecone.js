// ✅ Use native fetch in Node 18+ (no node-fetch import needed)
const { Pinecone } = require("@pinecone-database/pinecone");

const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

async function getEmbedding(text) {
    const HF_API_URL = `https://api-inference.huggingface.co/pipeline/feature-extraction/${HF_MODEL}`;

    const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(text)
    });

    if (!response.ok) {
        throw new Error(`HF API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Flatten nested arrays if needed
    if (Array.isArray(result[0]) && Array.isArray(result[0][0])) {
        return result[0][0];
    }
    return result[0];
}

module.exports = async function handler(req, res) {
    try {
        const keywords = ["Finance", "Business", "Economy", "Education", "Technology", "Health", "Science", "Geopolitics", "Bitcoin"];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];

        // Fetch from Twitter API
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

        // Ensure index exists
        const indexName = "twitter-data";
        const existingIndexes = await pc.listIndexes();

        if (!existingIndexes.indexes.some(idx => idx.name === indexName)) {
            await pc.createIndex({
                name: indexName,
                dimension: 384, // for all-MiniLM-L6-v2
                metric: "cosine",
                spec: {
                    serverless: {
                        cloud: "aws",
                        region: "us-east-1"
                    }
                }
            });

            console.log(`Index ${indexName} created. Waiting until ready...`);
            await pc.waitUntilReady(indexName);
        }

        const index = pc.index(indexName);

        // Store each tweet embedding
        for (let tweet of twitterData.data) {
            try {
                const vector = await getEmbedding(tweet.text);

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

        res.status(200).json({ message: `Stored ${twitterData.data.length} tweets for keyword: ${keyword}` });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};
