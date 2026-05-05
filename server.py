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
from openai import OpenAI
import anthropic
from dotenv import load_dotenv
import json

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# API Keys
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Clients
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
groq_client = OpenAI(api_key=GROQ_API_KEY, base_url="https://api.groq.com/openai/v1") if GROQ_API_KEY else None
anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

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
    model_id: str = "gemini-1.5-flash"

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running"}

@app.get("/api/v1/models")
def get_available_models():
    models = []
    if GEMINI_API_KEY:
        models.extend([
            {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash", "provider": "Google"},
            {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "provider": "Google"},
            {"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash", "provider": "Google"}
        ])
    if OPENAI_API_KEY:
        models.extend([
            {"id": "gpt-4o", "name": "GPT-4o", "provider": "OpenAI"},
            {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "provider": "OpenAI"},
            {"id": "gpt-4-turbo", "name": "GPT-4 Turbo", "provider": "OpenAI"},
            {"id": "o1-preview", "name": "o1 Preview", "provider": "OpenAI"},
            {"id": "o1-mini", "name": "o1 Mini", "provider": "OpenAI"}
        ])
    if ANTHROPIC_API_KEY:
        models.extend([
            {"id": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet", "provider": "Anthropic"},
            {"id": "claude-3-5-haiku-20241022", "name": "Claude 3.5 Haiku", "provider": "Anthropic"},
            {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus", "provider": "Anthropic"}
        ])
    if GROQ_API_KEY:
        models.extend([
            {"id": "llama-3.3-70b-versatile", "name": "Llama 3.3 70B (Groq)", "provider": "Groq"},
            {"id": "llama-3.1-8b-instant", "name": "Llama 3.1 8B (Groq)", "provider": "Groq"},
            # {"id": "deepseek-r1-distill-llama-70b", "name": "DeepSeek R1 70B (Groq)", "provider": "Groq"}
        ])
    return models

@app.post("/api/v1/predict-instant")
def predict_instant(request: Request):
    try:
        disease = disease_model.predict([request.symptoms.lower()])[0]
        return {"disease": disease}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def stream_gemini(model_id, prompt):
    try:
        model = genai.GenerativeModel(model_id)
        response = model.generate_content(prompt, stream=True)
        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        logger.error(f"Gemini Streaming Error: {e}")
        yield f"Error: {str(e)}"

async def stream_openai_like(client, model_id, prompt):
    try:
        response = client.chat.completions.create(
            model=model_id,
            messages=[{"role": "user", "content": prompt}],
            stream=True
        )
        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    except Exception as e:
        logger.error(f"OpenAI-like Streaming Error: {e}")
        yield f"Error: {str(e)}"

async def stream_anthropic(prompt, model_id):
    try:
        with anthropic_client.messages.stream(
            model=model_id,
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}]
        ) as stream:
            for text in stream.text_stream:
                yield text
    except Exception as e:
        logger.error(f"Anthropic Streaming Error: {e}")
        yield f"Error: {str(e)}"

@app.post("/api/v1/analyze-deep-stream")
async def analyze_deep_stream(request: Request):
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

    if "gemini" in request.model_id:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=400, detail="Gemini API Key missing")
        return StreamingResponse(stream_gemini(request.model_id, prompt), media_type="text/plain")
    
    elif "gpt" in request.model_id or "o1" in request.model_id:
        if not openai_client:
            raise HTTPException(status_code=400, detail="OpenAI API Key missing")
        return StreamingResponse(stream_openai_like(openai_client, request.model_id, prompt), media_type="text/plain")
    
    elif "claude" in request.model_id:
        if not anthropic_client:
            raise HTTPException(status_code=400, detail="Anthropic API Key missing")
        return StreamingResponse(stream_anthropic(prompt, request.model_id), media_type="text/plain")
    
    elif any(x in request.model_id for x in ["llama", "mixtral", "gemma", "deepseek"]):
        if not groq_client:
            raise HTTPException(status_code=400, detail="Groq API Key missing")
        return StreamingResponse(stream_openai_like(groq_client, request.model_id, prompt), media_type="text/plain")
    
    else:
        raise HTTPException(status_code=400, detail="Unsupported model")

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
