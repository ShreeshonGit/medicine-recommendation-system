import streamlit as st
import requests
import json
import time

# --------------------------------------------------
# Page Config
# --------------------------------------------------
st.set_page_config(
    page_title="AI Disease & Treatment Predictor",
    page_icon="🩺",
    layout="centered"
)

# --------------------------------------------------
# Custom CSS (UI + Animations)
# --------------------------------------------------
st.markdown("""
<style>
body {
    background-color: #f5f7fb;
}

.main {
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 12px;
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

.card {
    background: linear-gradient(135deg, #e3f2fd, #f1f8e9);
    padding: 20px;
    border-radius: 12px;
    margin-top: 20px;
    animation: fadeIn 0.6s ease-in-out;
}

.result-title {
    font-size: 22px;
    font-weight: 600;
    color: #1b5e20;
}

.result-text {
    font-size: 18px;
    color: #263238;
    margin-top: 5px;
}

@keyframes fadeIn {
    from {opacity: 0; transform: translateY(10px);}
    to {opacity: 1; transform: translateY(0);}
}

.predict-btn {
    background: linear-gradient(90deg, #1976d2, #42a5f5);
    color: white;
    font-size: 18px;
    padding: 0.6rem;
    border-radius: 8px;
}
</style>
""", unsafe_allow_html=True)

# --------------------------------------------------
# Header
# --------------------------------------------------
st.markdown('<div class="title">🩺 AI Disease & Treatment Predictor</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="subtitle">Predict respiratory disease from symptoms and get treatment recommendations</div>',
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

    submit = st.form_submit_button("🔍 Predict")

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

        with st.spinner("🧠 Analyzing symptoms..."):
            time.sleep(0.8)  # UI smoothness

            try:
                response = requests.post(
                    API_URL,
                    data=json.dumps(payload),
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )

                if response.status_code == 200:
                    result = response.json()

                    st.markdown('<div class="card">', unsafe_allow_html=True)
                    st.markdown(
                        f'<div class="result-title">🦠 Predicted Disease</div>'
                        f'<div class="result-text">{result["predicted_disease"].title()}</div>',
                        unsafe_allow_html=True
                    )

                    st.markdown(
                        f'<div class="result-title">💊 Recommended Treatment</div>'
                        f'<div class="result-text">{result["recommended_treatment"]}</div>',
                        unsafe_allow_html=True
                    )
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
    "<center>⚡ Built with FastAPI + Streamlit | AI-powered Healthcare Demo</center>",
    unsafe_allow_html=True
)