# import os
# import json
# import google.generativeai as genai

# # Configure Gemini API
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# def extract_resume_data_with_llm(text):
#     """Analyzes resume text using Gemini and returns structured JSON."""
#     print("Extracting resume data with Gemini...")
#     model = genai.GenerativeModel('gemini-2.5-flash')
#     prompt = f"""
#     You are an expert HR data extraction system. Analyze the following resume text and convert it into a structured JSON object.
#     Follow this exact JSON structure:
#     {{
#       "contact_information": {{"name": "...", "email": "...", "phone": "...", "linkedin_url": "...", "github_url": "..."}},
#       "summary": "...",
#       "work_experience": [{{"job_title": "...", "company": "...", "start_date": "...", "end_date": "...", "responsibilities": ["..."]}}],
#       "education": [{{"degree": "...", "institution": "...", "graduation_date": "..."}}],
#       "skills": {{"technical": ["..."], "soft": ["..."]}},
#       "projects": [{{"name": "...", "description": "...", "technologies": ["..."]}}]
#     }}
#     If a field is not present, omit it or set its value to null. Your entire output must be ONLY the JSON object, no additional text.
#     Resume Text:
#     ---
#     {text}
#     ---
#     """
#     try:
#         response = model.generate_content(prompt)
#         # Clean the response text to extract JSON
#         response_text = response.text.strip()
#         # Remove any markdown code blocks if present
#         if response_text.startswith('```json'):
#             response_text = response_text[7:]
#         if response_text.startswith('```'):
#             response_text = response_text[3:]
#         if response_text.endswith('```'):
#             response_text = response_text[:-3]
#         response_text = response_text.strip()
        
#         return json.loads(response_text)
#     except Exception as e:
#         print(f"Error in Gemini resume extraction: {e}")
#         return None

# def extract_jd_data_with_llm(text):
#     """Analyzes job description text using Gemini and returns structured JSON."""
#     model = genai.GenerativeModel('gemini-2.5-flash')
#     prompt = f"""
#     You are an expert recruitment data analyst. Analyze the following job description and extract key skills, technologies, and qualifications into a structured JSON object.
#     Use keys like "required_qualifications", "preferred_skills", "responsibilities". The values should be arrays of concise keywords.
#     Your entire output must be ONLY a valid JSON object, no additional text.
#     Job Description Text:
#     ---
#     {text}
#     ---
#     """
#     try:
#         response = model.generate_content(prompt)
#         # Clean the response text to extract JSON
#         response_text = response.text.strip()
#         # Remove any markdown code blocks if present
#         if response_text.startswith('```json'):
#             response_text = response_text[7:]
#         if response_text.startswith('```'):
#             response_text = response_text[3:]
#         if response_text.endswith('```'):
#             response_text = response_text[:-3]
#         response_text = response_text.strip()
        
#         return json.loads(response_text)
#     except Exception as e:
#         print(f"Error in Gemini JD extraction: {e}")
#         return None

# def analyze_match_with_llm(resume_data, jd_data):
#     """Compares resume and JD data using Gemini and returns a final analysis report."""
#     model = genai.GenerativeModel('gemini-2.5-flash')
#     resume_json_str = json.dumps(resume_data, indent=2)
#     jd_json_str = json.dumps(jd_data, indent=2)
#     prompt = f"""
#     You are an expert ATS and career coach. Analyze the provided resume and job description JSON.
#     Generate a match report with an 'ats_score_percent' (0-100), a 'summary' (string), 'what_matched' (array of objects with 'item' and 'reason'), and 'what_is_missing' (array of objects with 'item' and 'recommendation').
#     Your entire output must be ONLY a valid JSON object with that structure, no additional text.

#     --- RESUME JSON ---
#     {resume_json_str}

#     --- JOB DESCRIPTION JSON ---
#     {jd_json_str}
#     """
#     try:
#         response = model.generate_content(prompt)
#         # Clean the response text to extract JSON
#         response_text = response.text.strip()
#         # Remove any markdown code blocks if present
#         if response_text.startswith('```json'):
#             response_text = response_text[7:]
#         if response_text.startswith('```'):
#             response_text = response_text[3:]
#         if response_text.endswith('```'):
#             response_text = response_text[:-3]
#         response_text = response_text.strip()
        
#         return json.loads(response_text)
#     except Exception as e:
#         print(f"Error in Gemini match analysis: {e}")
#         return None

import os
import json
import google.generativeai as genai
import re

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL = genai.GenerativeModel("gemini-2.5-flash")


# ------------------ JSON SAFETY HELPERS ------------------

def clean_json(text):
    text = text.strip()

    # remove markdown blocks
    text = re.sub(r"^```json", "", text)
    text = re.sub(r"^```", "", text)
    text = re.sub(r"```$", "", text)

    # keep only JSON object
    start = text.find("{")
    end = text.rfind("}") + 1

    return text[start:end]


def safe_json_load(text):
    try:
        return json.loads(text)
    except Exception:
        print("\n---- RAW GEMINI OUTPUT ----\n", text, "\n-------------------------\n")
        raise


# ------------------ RESUME EXTRACTION ------------------

def extract_resume_data_with_llm(text):
    print("Extracting resume data with Gemini...")

    prompt = f"""
Return ONLY valid JSON.

NO text outside JSON.

Structure:

{{
  "skills": [],
  "experience": [],
  "education": [],
  "projects": [],
  "keywords": []
}}

Resume:
{text}
"""

    response = MODEL.generate_content(prompt)
    cleaned = clean_json(response.text)
    return safe_json_load(cleaned)


# ------------------ JD EXTRACTION ------------------

def extract_jd_data_with_llm(text):
    print("Extracting JD data with Gemini...")

    prompt = f"""
Return ONLY valid JSON.

NO text outside JSON.

Structure:

{{
  "skills": [],
  "requirements": [],
  "responsibilities": [],
  "keywords": []
}}

Job Description:
{text}
"""

    response = MODEL.generate_content(prompt)
    cleaned = clean_json(response.text)
    return safe_json_load(cleaned)


# ------------------ MATCH ANALYSIS ------------------

def analyze_match_with_llm(resume_data, jd_data):
    print("Running ATS match analysis...")

    prompt = f"""
Return ONLY valid JSON.

NO explanation.

Structure:

{{
  "atsScorePercent": 0,
  "summary": "",
  "whatMatched": [{{"item": "", "reason": ""}}],
  "whatIsMissing": [{{"item": "", "recommendation": ""}}]
}}

Resume:
{json.dumps(resume_data)}

Job Description:
{json.dumps(jd_data)}
"""

    response = MODEL.generate_content(prompt)
    cleaned = clean_json(response.text)
    return safe_json_load(cleaned)
