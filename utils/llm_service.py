import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)

def generate_sql(query):
    if not API_KEY:
        return "Error: API Key not found. Please set GOOGLE_API_KEY in .env file."

    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = f"""
    You are an expert SQL generator. Convert the following natural language query into a valid SQL command.
    
    Rules:
    1. If the query is NOT related to SQL, databases, or data retrieval, strictly return "NOT_RELEVANT".
    2. Do not provide any explanations, just the SQL code.
    3. If the query is ambiguous, try to generate the most likely SQL or return "NOT_RELEVANT" if it's completely unclear.
    
    User Query: {query}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Basic cleanup if the model adds markdown code blocks
        if text.startswith("```sql"):
            text = text[6:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        return text.strip()
    except Exception as e:
        return f"Error generating SQL: {str(e)}"
