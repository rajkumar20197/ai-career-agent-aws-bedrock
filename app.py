import streamlit as st
import boto3
import json
from botocore.exceptions import ClientError
import os

# Page config
st.set_page_config(
    page_title="AI Career Agent - AWS Bedrock Demo",
    page_icon="🚀",
    layout="wide"
)

# Title
st.title("🚀 AI Career Agent Platform")
st.markdown("**AWS AI Agent Global Hackathon - Live Demo**")
st.markdown("**Powered by AWS Bedrock Claude 3.5 Haiku**")

# AWS Configuration from Streamlit secrets
try:
    AWS_REGION = st.secrets["VITE_AWS_REGION"]
    AWS_ACCESS_KEY = st.secrets["VITE_AWS_ACCESS_KEY_ID"] 
    AWS_SECRET_KEY = st.secrets["VITE_AWS_SECRET_ACCESS_KEY"]
    MODEL_ID = st.secrets.get("VITE_BEDROCK_MODEL_ID", "anthropic.claude-3-5-haiku-20241022-v1:0")
except:
    # Fallback to environment variables
    AWS_REGION = os.getenv('VITE_AWS_REGION', 'us-east-1')
    AWS_ACCESS_KEY = os.getenv('VITE_AWS_ACCESS_KEY_ID', '')
    AWS_SECRET_KEY = os.getenv('VITE_AWS_SECRET_ACCESS_KEY', '')
    MODEL_ID = "anthropic.claude-3-5-haiku-20241022-v1:0"

# Sidebar info
st.sidebar.header("🔧 Configuration")
st.sidebar.write(f"**Region:** {AWS_REGION}")
st.sidebar.write(f"**Model:** Claude 3.5 Haiku")
st.sidebar.write("**Status:** Live AWS Integration")

# Check credentials
if not AWS_ACCESS_KEY or not AWS_SECRET_KEY:
    st.error("⚠️ AWS credentials not configured!")
    st.info("This demo requires AWS Bedrock access. Contact the developer for a live demonstration.")
    st.stop()

# Initialize Bedrock client
@st.cache_resource
def get_bedrock_client():
    try:
        return boto3.client(
            'bedrock-runtime',
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY
        )
    except Exception as e:
        st.error(f"Failed to initialize Bedrock client: {str(e)}")
        return None

# Call Bedrock function
def call_bedrock(prompt, max_tokens=300):
    client = get_bedrock_client()
    if not client:
        return "❌ Failed to connect to AWS Bedrock"
    
    try:
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}]
        })
        
        response = client.invoke_model(
            modelId=MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=body
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
        
    except ClientError as e:
        if 'AccessDeniedException' in str(e):
            return "❌ Access Denied: Need Bedrock model access in AWS Console"
        return f"❌ AWS Error: {str(e)}"
    except Exception as e:
        return f"❌ Error: {str(e)}"

# Main demo
st.header("🧪 Live AWS Bedrock Integration Test")

if st.button("🔍 Test Connection", type="primary"):
    with st.spinner("Testing AWS Bedrock..."):
        result = call_bedrock("Hello! This is a test for the AWS AI Agent Hackathon. Please respond with 'AWS Bedrock is working!' and a brief career tip.")
        
        if result and not result.startswith("❌"):
            st.success("✅ AWS Bedrock Connection Successful!")
            st.write("**AI Response:**")
            st.write(result)
        else:
            st.error("❌ Connection Failed")
            st.write(result)

# AI Features Demo
st.header("🤖 AI Career Agent Features")

# Job Matching
st.subheader("💼 AI Job Matching")
col1, col2 = st.columns(2)

with col1:
    job_title = st.text_input("Job Title", "Software Engineer")
    user_skills = st.text_area("Your Skills", "Python, AWS, React, 2 years experience")

with col2:
    job_company = st.text_input("Company", "Amazon")
    job_requirements = st.text_area("Job Requirements", "Python, AWS, React, 3+ years experience")

if st.button("🎯 Calculate Job Match"):
    with st.spinner("AI analyzing compatibility..."):
        prompt = f"""
        Analyze job compatibility:
        Job: {job_title} at {job_company}
        Requirements: {job_requirements}
        Candidate Skills: {user_skills}
        
        Provide a score (0-100) and brief explanation.
        """
        result = call_bedrock(prompt)
        if result and not result.startswith("❌"):
            st.success("✅ Job Match Analysis Complete!")
            st.write(result)
        else:
            st.error("Analysis failed")

# Resume Analysis
st.subheader("📄 AI Resume Analysis")
resume_text = st.text_area("Resume Text", "John Doe\nSoftware Engineer\n2 years experience with Python, React, AWS")

if st.button("🔍 Analyze Resume"):
    with st.spinner("AI analyzing resume..."):
        prompt = f"""
        Analyze this resume and provide:
        1. Score (0-100)
        2. Top 2 strengths
        3. Top 2 improvements needed
        
        Resume: {resume_text}
        """
        result = call_bedrock(prompt)
        if result and not result.startswith("❌"):
            st.success("✅ Resume Analysis Complete!")
            st.write(result)
        else:
            st.error("Analysis failed")

# Career Roadmap
st.subheader("🗺️ AI Career Roadmap")
col1, col2 = st.columns(2)

with col1:
    current_role = st.text_input("Current Role", "Junior Developer")
    
with col2:
    target_role = st.text_input("Target Role", "Senior Developer")

if st.button("🚀 Generate Roadmap"):
    with st.spinner("AI creating roadmap..."):
        prompt = f"""
        Create a career roadmap from {current_role} to {target_role}.
        Include:
        1. Key skills to develop
        2. Timeline estimate
        3. 2 actionable steps
        """
        result = call_bedrock(prompt)
        if result and not result.startswith("❌"):
            st.success("✅ Career Roadmap Generated!")
            st.write(result)
        else:
            st.error("Generation failed")

# Footer
st.markdown("---")
st.markdown("**🏆 AWS AI Agent Global Hackathon 2025**")
st.markdown("**🔗 Repository:** https://github.com/rajkumar20197/ai-career-agent-aws-bedrock")
st.markdown("**⚡ Real AWS Bedrock Integration - Not Mock Data**")