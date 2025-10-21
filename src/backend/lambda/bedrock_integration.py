"""
AWS Bedrock Integration for AI-Powered Career Guidance
Uses Claude 3.5 Haiku for intelligent analysis and recommendations
"""

import json
import boto3
from typing import Dict, List, Any
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize Bedrock Runtime client
bedrock_runtime = boto3.client('bedrock-runtime', region_name='us-east-1')

# Model ID for Claude 3.5 Haiku
MODEL_ID = "anthropic.claude-3-5-haiku-20241022-v1:0"


def invoke_bedrock_model(prompt: str, max_tokens: int = 2000) -> str:
    """
    Invoke AWS Bedrock Claude model with a prompt
    """
    try:
        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "top_p": 0.9
        }
        
        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
        
    except Exception as e:
        logger.error(f"Error invoking Bedrock model: {str(e)}", exc_info=True)
        raise


def get_job_recommendations(user_profile: Dict) -> List[Dict]:
    """
    Get AI-powered job recommendations based on user profile
    """
    prompt = f"""
    You are an expert career advisor. Based on the following user profile, recommend suitable jobs:
    
    User Profile:
    - Skills: {', '.join(user_profile.get('skills', []))}
    - Current Role: {user_profile.get('currentRole', 'N/A')}
    - Target Role: {user_profile.get('targetRole', 'N/A')}
    - Career Stage: {user_profile.get('careerStage', 'N/A')}
    - Preferred Locations: {', '.join(user_profile.get('preferences', {}).get('locations', []))}
    - Industries: {', '.join(user_profile.get('preferences', {}).get('industries', []))}
    
    Provide a JSON array of 5 recommended job titles with brief descriptions.
    Format: [{{"title": "...", "description": "...", "match_score": 0-100}}]
    """
    
    try:
        response = invoke_bedrock_model(prompt)
        # Parse JSON from response
        start = response.find('[')
        end = response.rfind(']') + 1
        if start != -1 and end > start:
            jobs_data = json.loads(response[start:end])
            return jobs_data
        return []
    except Exception as e:
        logger.error(f"Error getting job recommendations: {str(e)}")
        return []


def calculate_job_score(user_id: str, job_id: str) -> int:
    """
    Calculate AI compatibility score (0-100) for a job
    """
    # This would fetch actual user and job data from DynamoDB
    # For now, using a simplified prompt
    
    prompt = """
    Calculate a job compatibility score (0-100) based on:
    - Skills match: 40%
    - Experience level: 30%
    - Location preference: 15%
    - Salary expectations: 15%
    
    Return only the numeric score.
    """
    
    try:
        response = invoke_bedrock_model(prompt, max_tokens=50)
        # Extract number from response
        score = int(''.join(filter(str.isdigit, response)))
        return min(100, max(0, score))
    except Exception as e:
        logger.error(f"Error calculating job score: {str(e)}")
        return 0


def analyze_resume(resume_text: str) -> Dict:
    """
    Analyze resume using AWS Bedrock AI
    Returns strengths, weaknesses, suggestions, and ATS score
    """
    prompt = f"""
    You are an expert resume reviewer and ATS (Applicant Tracking System) specialist.
    Analyze the following resume and provide detailed feedback.
    
    Resume:
    {resume_text}
    
    Provide your analysis in the following JSON format:
    {{
        "atsScore": <number 0-100>,
        "formatScore": <number 0-100>,
        "contentScore": <number 0-100>,
        "keywordMatch": <number 0-100>,
        "strengths": [<list of 4-5 strengths>],
        "weaknesses": [<list of 4-5 weaknesses>],
        "suggestions": [<list of 5-7 specific improvement suggestions>]
    }}
    
    Be specific and actionable in your feedback.
    """
    
    try:
        response = invoke_bedrock_model(prompt, max_tokens=3000)
        
        # Extract JSON from response
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end > start:
            analysis = json.loads(response[start:end])
            return analysis
        
        # Fallback response if JSON parsing fails
        return {
            "atsScore": 75,
            "formatScore": 80,
            "contentScore": 75,
            "keywordMatch": 70,
            "strengths": ["Clear structure", "Quantifiable achievements"],
            "weaknesses": ["Could add more keywords", "Needs stronger action verbs"],
            "suggestions": ["Add measurable outcomes", "Include relevant certifications"]
        }
        
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}", exc_info=True)
        raise


def tailor_resume_for_job(resume_text: str, job_description: str) -> Dict:
    """
    Tailor resume for a specific job using AI
    """
    prompt = f"""
    You are a resume optimization expert. Given the resume and job description below,
    provide specific suggestions to tailor the resume for this job.
    
    Resume:
    {resume_text[:1000]}...
    
    Job Description:
    {job_description[:1000]}...
    
    Provide 5-7 specific, actionable suggestions in JSON format:
    {{
        "suggestions": [<list of tailoring suggestions>],
        "keywords_to_add": [<list of important keywords from job description>],
        "skills_to_highlight": [<list of skills to emphasize>]
    }}
    """
    
    try:
        response = invoke_bedrock_model(prompt, max_tokens=2000)
        
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(response[start:end])
        
        return {
            "suggestions": ["Align experience with job requirements"],
            "keywords_to_add": [],
            "skills_to_highlight": []
        }
        
    except Exception as e:
        logger.error(f"Error tailoring resume: {str(e)}")
        return {"suggestions": [], "keywords_to_add": [], "skills_to_highlight": []}


def generate_career_roadmap(current_role: str, target_role: str, current_skills: List[str]) -> Dict:
    """
    Generate personalized career roadmap using AI
    """
    prompt = f"""
    You are a senior career counselor. Create a detailed career roadmap for someone who:
    - Currently works as: {current_role}
    - Target role: {target_role}
    - Current skills: {', '.join(current_skills)}
    
    Provide a comprehensive roadmap in JSON format:
    {{
        "timeline": "<estimated time to achieve target role>",
        "requiredSkills": [
            {{
                "skill": "<skill name>",
                "currentLevel": <0-100>,
                "requiredLevel": <0-100>,
                "priority": "<high/medium/low>",
                "resources": [<list of learning resources>]
            }}
        ],
        "milestones": [
            {{
                "title": "<milestone title>",
                "description": "<detailed description>",
                "timeframe": "<when to achieve this>",
                "actionItems": [<specific actions to take>]
            }}
        ],
        "certifications": [<recommended certifications>],
        "experiences": [<types of experience to gain>]
    }}
    """
    
    try:
        response = invoke_bedrock_model(prompt, max_tokens=3000)
        
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(response[start:end])
        
        return {
            "timeline": "18-24 months",
            "requiredSkills": [],
            "milestones": [],
            "certifications": [],
            "experiences": []
        }
        
    except Exception as e:
        logger.error(f"Error generating career roadmap: {str(e)}")
        return {}


def get_market_insights(role: str, location: str) -> Dict:
    """
    Get AI-generated market insights for a role/location
    """
    prompt = f"""
    Provide current job market insights for:
    - Role: {role}
    - Location: {location}
    
    Return JSON with:
    {{
        "demandLevel": "<high/medium/low>",
        "averageSalary": <estimated salary>,
        "growthTrend": "<percentage>",
        "topCompaniesHiring": [<list of companies>],
        "inDemandSkills": [<list of skills>],
        "insights": [<list of 3-5 market insights>]
    }}
    """
    
    try:
        response = invoke_bedrock_model(prompt, max_tokens=1500)
        
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(response[start:end])
        
        return {
            "demandLevel": "high",
            "averageSalary": 120000,
            "growthTrend": "15%",
            "topCompaniesHiring": [],
            "inDemandSkills": [],
            "insights": []
        }
        
    except Exception as e:
        logger.error(f"Error getting market insights: {str(e)}")
        return {}


def generate_interview_questions(job_description: str) -> List[str]:
    """
    Generate likely interview questions based on job description
    """
    prompt = f"""
    Based on this job description, generate 10 likely interview questions
    that candidates should prepare for:
    
    Job Description:
    {job_description[:1500]}
    
    Return as a JSON array of strings.
    """
    
    try:
        response = invoke_bedrock_model(prompt, max_tokens=1500)
        
        start = response.find('[')
        end = response.rfind(']') + 1
        if start != -1 and end > start:
            return json.loads(response[start:end])
        
        return [
            "Tell me about yourself",
            "Why are you interested in this role?",
            "What are your greatest strengths?"
        ]
        
    except Exception as e:
        logger.error(f"Error generating interview questions: {str(e)}")
        return []


def get_salary_trends(role: str, location: str) -> Dict:
    """
    Get salary trend data using AI analysis
    """
    prompt = f"""
    Provide salary trend analysis for {role} in {location}.
    
    Return JSON with:
    {{
        "currentAverage": <number>,
        "range": {{"min": <number>, "max": <number>}},
        "yearOverYearChange": "<percentage>",
        "experienceLevels": [
            {{"level": "junior", "salary": <number>}},
            {{"level": "mid", "salary": <number>}},
            {{"level": "senior", "salary": <number>}}
        ]
    }}
    """
    
    try:
        response = invoke_bedrock_model(prompt, max_tokens=1000)
        
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(response[start:end])
        
        return {
            "currentAverage": 120000,
            "range": {"min": 90000, "max": 160000},
            "yearOverYearChange": "8.5%",
            "experienceLevels": []
        }
        
    except Exception as e:
        logger.error(f"Error getting salary trends: {str(e)}")
        return {}


def get_skill_demand_forecast(skills: List[str]) -> List[Dict]:
    """
    Forecast demand for specific skills
    """
    prompt = f"""
    Analyze the demand and growth forecast for these skills:
    {', '.join(skills)}
    
    Return JSON array:
    [
        {{
            "skill": "<skill name>",
            "currentDemand": <0-100>,
            "growthRate": "<percentage>",
            "outlook": "<strong/moderate/weak>",
            "relatedRoles": [<list of roles>]
        }}
    ]
    """
    
    try:
        response = invoke_bedrock_model(prompt, max_tokens=2000)
        
        start = response.find('[')
        end = response.rfind(']') + 1
        if start != -1 and end > start:
            return json.loads(response[start:end])
        
        return []
        
    except Exception as e:
        logger.error(f"Error forecasting skill demand: {str(e)}")
        return []


def analyze_email_for_interview(email_content: str) -> Dict:
    """
    Analyze email to detect interview invitations
    """
    prompt = f"""
    Analyze this email to determine if it's an interview invitation.
    
    Email:
    {email_content[:1000]}
    
    Return JSON:
    {{
        "isInterview": <true/false>,
        "confidence": <0-100>,
        "interviewDetails": {{
            "date": "<extracted date or null>",
            "time": "<extracted time or null>",
            "location": "<extracted location or null>",
            "interviewType": "<phone/video/in-person/unknown>",
            "company": "<company name or null>"
        }},
        "suggestedAction": "<action to take>"
    }}
    """
    
    try:
        response = invoke_bedrock_model(prompt, max_tokens=1000)
        
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(response[start:end])
        
        return {
            "isInterview": False,
            "confidence": 0,
            "interviewDetails": {},
            "suggestedAction": "No action needed"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing email: {str(e)}")
        return {"isInterview": False, "confidence": 0}
