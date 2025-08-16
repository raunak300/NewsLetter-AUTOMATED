from fastapi import FastAPI
from pydantic import BaseModel
import joblib

# FastAPI app
app = FastAPI()

# Models load
vectorizer = joblib.load("vectorizer.pkl")
classifier = joblib.load("news_classifier.pkl")

# Input schema
class NewsInput(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "Fake News Detection API is running 🚀"}

@app.post("/predict")
def predict_news(news: NewsInput):
    # Transform input
    X = vectorizer.transform([news.text])
    
    # Predict
    prediction = classifier.predict(X)[0]
    
    result = "FAKE" if prediction == 0 else "REAL"
    return {"prediction": result}
