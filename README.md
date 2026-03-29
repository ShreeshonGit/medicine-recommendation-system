<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1976d2,50:42a5f5,100:1976d2&height=220&section=header&text=PulmoCare%20AI&fontSize=80&fontColor=FFFFFF&fontAlignY=38&desc=Intelligent%20Respiratory%20Decision%20Support&descAlignY=60&descColor=ffffff&descSize=20" width="100%"/>
</p>

<br />
  <p><i>A hybrid Clinical Decision Support System (CDSS) combining traditional SVM Machine Learning with Google Gemini 2.5 Flash for expert-level pulmonary analysis.</i></p>

  <p>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" /></a>
    <a href="https://scikit-learn.org/"><img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="Scikit-Learn" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" /></a>
  </p>
</div>

---

### 🚀 Key Features

*   **⚡ Instant ML Triage**: Uses a high-performance **Linear SVM** model to provide an immediate diagnostic guess based on 38,000+ clinical records.
*   **🤖 Senior AI Validation**: Integrates **Gemini 2.5 Flash** to act as a Senior Pulmonologist, cross-validating the ML prediction with deep clinical reasoning.
*   **🌊 Real-time Streaming**: Features an asynchronous streaming API (SSE) for zero-latency clinical report generation.
*   **📋 Clinical Grade Reports**: Generates structured Markdown reports including **Pathophysiology**, **Age-appropriate Dosages**, and **Emergency Red Flags**.
*   **🎨 Modern Dashboard**: A premium Next.js 15+ interface with interactive icons, diagnostic tracing, and responsive design.

---

### 🛠️ Architecture

The system operates on a **Hybrid Intelligence** model:
1.  **Frontend (Next.js)**: Captures patient presentation (Symptoms + Age).
2.  **Backend (FastAPI)**: Orchestrates the workflow between local ML and Cloud AI.
3.  **ML Layer (Scikit-Learn)**: Provides the baseline statistical prediction.
4.  **Cognitive Layer (Gemini)**: Provides the semantic clinical validation and treatment plan.

---

### 📦 Getting Started

#### 1. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (.env)
GOOGLE_API_KEY=your_gemini_api_key_here

# Run the server
python server.py
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Access the app at `http://localhost:3000`*

---

### 📂 Project Structure

```text
├── frontend/             # Next.js 15 App (React, Tailwind, Framer Motion)
├── saved_models/         # Pre-trained Joblib models (SVM, Random Forest)
├── server.py             # FastAPI Backend with Gemini Integration
├── app.py                # Legacy Streamlit UI Prototype
├── requirements.txt      # Python Backend Dependencies
└── Diagrams.md           # Mermaid-live Architecture Diagrams
```

---

### ⚠️ Medical Disclaimer
This software is intended for **Clinical Decision Support ONLY**. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified physician or other qualified health provider with any questions you may have regarding a medical condition.

<div align="center">
  <p>⚡ Built with precision for the future of AI-powered healthcare.</p>
</div>
