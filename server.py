from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import joblib
import pandas as pd
import logging
import uvicorn
import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Gemini Setup
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Using 'gemini-2.5-flash' as requested
    gemini_model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Load ML Models
try:
    disease_model = joblib.load("saved_models/disease_Linear_SVM.joblib")
    treatment_model = joblib.load("saved_models/treatment_disease_age_model.joblib")
    logger.info("ML Models Loaded")
except Exception as e:
    logger.error(f"Error: {e}")

class Request(BaseModel):
    symptoms: str
    age: int

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running"}

@app.post("/api/v1/predict-instant")
def predict_instant(request: Request):
    try:
        disease = disease_model.predict([request.symptoms.lower()])[0]
        # We still return this for the frontend to have context, 
        # but we will hide it from the final UI as requested.
        return {"disease": disease}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze-deep-stream")
async def analyze_deep_stream(request: Request):
    if not GEMINI_API_KEY:
        async def err_gen(): yield "AI Key missing."
        return StreamingResponse(err_gen(), media_type="text/plain")
    
    # Get ML prediction for internal comparison
    ml_disease = disease_model.predict([request.symptoms.lower()])[0]
    
    prompt = f"""
You are a senior pulmonologist. Your task is to provide a comprehensive clinical report.
A preliminary ML system suggested: {ml_disease}.

INSTRUCTIONS:
1. Critically evaluate if '{ml_disease}' is the most likely diagnosis based on:
   - Symptoms: {request.symptoms}
   - Patient Age: {request.age}
2. Do NOT mention the "ML system" or "prediction" by name in the output. Simply provide your expert conclusion.
3. If you agree with the ML guess, explain the clinical reasoning. If you disagree, provide a corrected diagnosis with detailed justification.
4. Provide deep clinical insights into the pathophysiology of the condition.
5. Include specific, age-appropriate drug names, dosages, and durations.
6. List necessary diagnostic tests (Spirometry, CT, Bloodwork, etc.).
7. Highlight "Red Flag" symptoms requiring immediate ER visit.

OUTPUT FORMAT (Markdown):
# Final Clinical Report
**Diagnostic Confidence:** (Low / Moderate / High)

### Clinical Assessment & Insights
(Provide a detailed breakdown of the symptoms and why they point to a specific condition. Compare the likely cause with alternatives.)

### Primary Diagnosis
(The most probable condition)

### Detailed Treatment Plan
- **Pharmacotherapy:** (Specific drugs + dosage + duration)
- **Non-Pharmacological:** (Lifestyle, hydration, rest)

### Confirmatory Diagnostics
(Tests needed to finalize the diagnosis)

### Emergency Escalation Criteria
(Red flags)

### Medical References
(WHO, GINA, BTS, or CDC guidelines)
"""

    async def generate():
        try:
            response = gemini_model.generate_content(prompt, stream=True)
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            logger.error(f"Streaming Error: {e}")
            yield f"Error: {str(e)}"

    return StreamingResponse(generate(), media_type="text/plain")

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
