import streamlit as st
import requests
import json
import time
import os
import google.generativeai as genai

# --------------------------------------------------
# Gemini Configuration
# --------------------------------------------------
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY") 
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# --------------------------------------------------
# Page Config
# --------------------------------------------------
st.set_page_config(
    page_title="AI Clinical Decision Support",
    page_icon="🩺",
    layout="centered"
)

# --------------------------------------------------
# Custom CSS
# --------------------------------------------------
st.markdown("""
<style>
body {
    background-color: #f5f7fb;
}

.title {
    font-size: 40px;
    font-weight: 700;
    color: #2c3e50;
    text-align: center;
}

.subtitle {
    font-size: 16px;
    color: #6c757d;
    text-align: center;
    margin-bottom: 30px;
}

.analysis-card {
    background: linear-gradient(135deg, #e8f5e9, #e3f2fd);
    padding: 20px;
    border-radius: 12px;
    margin-top: 20px;
    animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
    from {opacity: 0; transform: translateY(10px);}
    to {opacity: 1; transform: translateY(0);}
}
</style>
""", unsafe_allow_html=True)

# --------------------------------------------------
# Header
# --------------------------------------------------
st.markdown('<div class="title">🩺 AI Clinical Decision Support</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="subtitle">Clinically validated pulmonary disease & treatment recommendations</div>',
    unsafe_allow_html=True
)

# --------------------------------------------------
# Input Form
# --------------------------------------------------
with st.form("prediction_form"):
    symptoms = st.text_area(
        "📝 Enter Symptoms",
        placeholder="e.g. shortness of breath, wheezing, chest tightness"
    )

    age = st.number_input(
        "🎂 Enter Age",
        min_value=0,
        max_value=120,
        value=25
    )

    submit = st.form_submit_button("🔍 Generate Clinical Report")

# --------------------------------------------------
# API Configuration
# --------------------------------------------------
API_URL = "http://127.0.0.1:8000/predict"

# --------------------------------------------------
# Prediction Logic
# --------------------------------------------------
if submit:
    if not symptoms.strip():
        st.warning("⚠️ Please enter symptoms.")
    else:
        payload = {
            "symptoms": symptoms,
            "age": age
        }

        with st.spinner("🧠 Running clinical evaluation..."):
            time.sleep(0.5)

            try:
                response = requests.post(
                    API_URL,
                    data=json.dumps(payload),
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )

                if response.status_code == 200:
                    ml_result = response.json()

                    # -----------------------------
                    # Updated Gemini Prompt ONLY
                    # -----------------------------
                    prompt = f"""
You are a senior pulmonologist with 30+ years of clinical experience.

STRICT RULES:

Only handle pulmonary/respiratory conditions.

If symptoms are not pulmonary-related, clearly state that only pulmonary cases are supported.

If input is casual conversation (hello, how are you, etc.), respond politely and do not generate a medical report.

Do NOT mention any ML model, AI system, or prediction system.

Provide concise, evidence-based, clinically sound reasoning.

Consider patient age when assessing diagnosis and recommending treatment.

Critically evaluate the provided clinical report — do NOT automatically reject or accept it.

If the predicted diagnosis is reasonable, explain why. If incorrect or incomplete, provide corrected differential diagnosis with justification.

Identify and prioritize red-flag symptoms (e.g., hemoptysis, hypoxia, chest pain, severe breathlessness, high fever).

This is clinical decision support, not a definitive diagnosis.

Always include references from reputable sources (WHO, CDC, NIH, GINA, BTS, etc.).

Drug recommendations MUST follow standard treatment guidelines.

Include specific drug names AND typical adult or pediatric dosage ranges when appropriate.

If dosing depends on weight, clearly state “weight-based dosing required.”

Do NOT invent uncommon drugs or unsafe doses.

If diagnosis is uncertain, avoid definitive high-risk drug therapy and recommend evaluation instead.
Use calibrated clinical language. Avoid absolute certainty unless diagnosis is confirmed by objective evidence. Use probability-based phrasing such as “most consistent with,” “likely,” “possible,” or “cannot exclude.” Clearly acknowledge when additional data is required.

Patient Details:

Symptoms: {symptoms}

Age: {age}

System Clinical Report:
{ml_result}

Tasks:

Objectively validate the clinical reasoning.

Determine whether the proposed diagnosis explains ALL symptoms.

Provide a prioritized differential diagnosis if needed.

Adjust diagnosis if clinically required.

Provide age-appropriate treatment recommendations.

Include specific drug names with standard dosing ranges (adult vs pediatric).

Mention duration of therapy where applicable.

Escalate appropriately if red flags are present.

Output Format:

Final Clinical Report
Diagnostic Confidence Level (Low / Moderate / High)

Data Gaps That Limit Certainty

Likely Diagnosis:

Differential Diagnosis (if applicable):

Severity Assessment:

Recommended Treatment (with drug name + dosage + duration):

Alternatives (if needed):

When to Seek Immediate Care:

References (WHO/CDC/NIH/GINA etc.)
"""
                    gemini_response = gemini_model.generate_content(prompt)
                    final_report = gemini_response.text

                    # -----------------------------
                    # Display ONLY Final Report
                    # -----------------------------
                    st.markdown('<div class="analysis-card">', unsafe_allow_html=True)
                    st.markdown(final_report)
                    st.markdown('</div>', unsafe_allow_html=True)

                else:
                    st.error("❌ Prediction failed. Please try again later.")

            except requests.exceptions.ConnectionError:
                st.error("🚫 Cannot connect to server. Make sure FastAPI is running.")

            except Exception as e:
                st.error(f"Unexpected error: {e}")

# --------------------------------------------------
# Footer
# --------------------------------------------------
st.markdown("---")
st.markdown(
    "<center>⚕️ AI Clinical Decision Support | Pulmonary domain only | May contain errors.</center>",
    unsafe_allow_html=True
)
