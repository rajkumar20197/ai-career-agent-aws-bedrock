import streamlit as st
import boto3
import json
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Page config
st.set_page_config(
    page_title="AI Career Agent - AWS Bedrock Test",
    page_icon="🚀",
    layout="wide"
)

# Title
st.title("🚀 AI Career Agent - AWS Bedrock Integration Test")
st.markdown("**AWS AI Agent Global Hackathon - Live Integration Test**")

# AWS Configuration
AWS_REGION = os.getenv('VITE_AWS_REGION', 'us-east-1')
AWS_ACCESS_KEY = os.getenv('VITE_AWS_ACCESS_KEY_ID', '')
AWS_SECRET_KEY = os.getenv('VITE_AWS_SECRET_ACCESS_KEY', '')
MODEL_ID = "anthropic.claude-3-5-haiku-20241022-v1:0"

# Sidebar for configuration
st.sidebar.header("🔧 AWS Configuration")
st.sidebar.write(f"**Region:** {AWS_REGION}")
st.sidebar.write(f"**Model:** {MODEL_ID}")

# Check if credentials are configured
if not AWS_ACCESS_KEY or not AWS_SECRET_KEY:
    st.error("⚠️ AWS credentials not found! Please configure your .env file.")
    st.code("""
# Add to your .env file:
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here
VITE_AWS_REGION=us-east-1
    """)
    st.stop()

# Initialize Bedrock client
@st.cache_resource
def get_bedrock_client():
    try:
        client = boto3.client(
            'bedrock-runtime',
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY
        )
        return client
    except Exception as e:
        st.error(f"Failed to initialize Bedrock client: {str(e)}")
        return None

# Function to call Bedrock
def call_bedrock(prompt, max_tokens=500):
    client = get_bedrock_client()
    if not client:
        return None
    
    try:
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
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
        error_code = e.response['Error']['Code']
        if error_code == 'AccessDeniedException':
            return f"❌ Access Denied: You need to request access to {MODEL_ID} in AWS Bedrock console"
        else:
            return f"❌ AWS Error: {str(e)}"
    except Exception as e:
        return f"❌ Error: {str(e)}"

# Test connection
st.header("🔍 Connection Test")

if st.button("🧪 Test AWS Bedrock Connection", type="primary"):
    with st.spinner("Testing connection to AWS Bedrock..."):
        test_prompt = "Hello! This is a test for the AWS AI Agent Hackathon. Please respond with 'AWS Bedrock is working!' and a brief career tip."
        result = call_bedrock(test_prompt, max_tokens=100)
        
        if result and not result.startswith("❌"):
            st.success("✅ AWS Bedrock Connection Successful!")
            st.write("**Response:**")
            st.write(result)
        else:
            st.error("❌ Connection Failed")
            if result:
                st.write(result)

# AI Career Agent Features Demo
st.header("🤖 AI Career Agent Features Demo")

# Feature tabs
tab1, tab2, tab3, tab4 = st.tabs(["💼 Job Matching", "📄 Resume Analysis", "🗺️ Career Roadmap", "📊 Market Intelligence"])

with tab1:
    st.subheader("💼 AI-Powered Job Matching")
    
    col1, col2 = st.columns(2)
    
    with col1:
        job_title = st.text_input("Job Title", value="Software Engineer")
        job_company = st.text_input("Company", value="Amazon")
        job_requirements = st.text_area("Job Requirements", value="Python, AWS, React, 3+ years experience")
    
    with col2:
        user_skills = st.text_area("Your Skills", value="Python, JavaScript, AWS, React, 2 years experience")
        user_experience = st.text_area("Your Experience", value="Full-stack developer with cloud experience")
    
    if st.button("🎯 Calculate Job Match Score"):
        with st.spinner("AI analyzing job compatibility..."):
            prompt = f"""
            As an AI career agent, analyze the job compatibility between a candidate and job posting.
            
            Job Title: {job_title}
            Company: {job_company}
            Requirements: {job_requirements}
            
            Candidate Skills: {user_skills}
            Candidate Experience: {user_experience}
            
            Provide a compatibility score from 0-100 and explain the reasoning in 2-3 sentences.
            Format: "Score: X/100 - [explanation]"
            """
            
            result = call_bedrock(prompt)
            if result and not result.startswith("❌"):
                st.success("✅ Job Match Analysis Complete!")
                st.write(result)
            else:
                st.error("Failed to analyze job match")
                if result:
                    st.write(result)

with tab2:
    st.subheader("📄 AI Resume Analysis")
    
    resume_text = st.text_area("Paste your resume text here:", height=200, 
                              value="John Doe\nSoftware Engineer\n\nExperience:\n- Developed web applications using React and Node.js\n- Worked with AWS services\n- 2 years experience in full-stack development")
    
    if st.button("🔍 Analyze Resume"):
        with st.spinner("AI analyzing your resume..."):
            prompt = f"""
            As an expert resume reviewer, analyze this resume and provide:
            1. Overall score (0-100)
            2. Top 3 strengths
            3. Top 3 areas for improvement
            4. 2 specific actionable suggestions
            
            Resume:
            {resume_text}
            
            Keep the response concise and actionable.
            """
            
            result = call_bedrock(prompt)
            if result and not result.startswith("❌"):
                st.success("✅ Resume Analysis Complete!")
                st.write(result)
            else:
                st.error("Failed to analyze resume")
                if result:
                    st.write(result)

with tab3:
    st.subheader("🗺️ AI Career Roadmap")
    
    col1, col2 = st.columns(2)
    
    with col1:
        current_role = st.text_input("Current Role", value="Junior Software Engineer")
        target_role = st.text_input("Target Role", value="Senior Software Engineer")
    
    with col2:
        current_skills = st.text_area("Current Skills", value="JavaScript, React, Basic AWS")
        timeline = st.selectbox("Timeline", ["6 months", "1 year", "2 years"])
    
    if st.button("🚀 Generate Career Roadmap"):
        with st.spinner("AI creating your career roadmap..."):
            prompt = f"""
            Create a career roadmap for someone transitioning from {current_role} to {target_role} in {timeline}.
            
            Current Skills: {current_skills}
            
            Provide:
            1. 3-4 key skills to develop
            2. 2-3 major milestones
            3. Recommended learning resources
            4. Timeline breakdown
            
            Keep it practical and actionable.
            """
            
            result = call_bedrock(prompt)
            if result and not result.startswith("❌"):
                st.success("✅ Career Roadmap Generated!")
                st.write(result)
            else:
                st.error("Failed to generate roadmap")
                if result:
                    st.write(result)

with tab4:
    st.subheader("📊 AI Market Intelligence")
    
    col1, col2 = st.columns(2)
    
    with col1:
        market_role = st.text_input("Role to Research", value="Software Engineer")
        market_location = st.text_input("Location", value="San Francisco")
    
    with col2:
        market_experience = st.selectbox("Experience Level", ["Entry Level", "Mid Level", "Senior Level"])
    
    if st.button("📈 Get Market Insights"):
        with st.spinner("AI analyzing market data..."):
            prompt = f"""
            Provide market intelligence for {market_role} positions in {market_location} for {market_experience} professionals.
            
            Include:
            1. Salary range estimate
            2. Job market demand
            3. Top 3 in-demand skills
            4. Industry trends
            5. Career growth outlook
            
            Base this on general market knowledge and trends.
            """
            
            result = call_bedrock(prompt)
            if result and not result.startswith("❌"):
                st.success("✅ Market Intelligence Generated!")
                st.write(result)
            else:
                st.error("Failed to get market insights")
                if result:
                    st.write(result)

# Footer
st.markdown("---")
st.markdown("**🏆 Built for AWS AI Agent Global Hackathon 2025**")
st.markdown("**🔗 GitHub:** https://github.com/rajkumar20197/ai-career-agent-aws-bedrock")
st.markdown("**⚡ Powered by AWS Bedrock Claude 3.5 Haiku**")