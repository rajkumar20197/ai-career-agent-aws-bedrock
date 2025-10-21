"""
Main Lambda Handler for AI Career Agent Platform
Handles all API Gateway requests and routes to appropriate functions
"""

import json
import os
import boto3
from datetime import datetime
from typing import Dict, Any
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')
bedrock_runtime = boto3.client('bedrock-runtime', region_name='us-east-1')

# Environment variables
USERS_TABLE = os.environ.get('USERS_TABLE', 'CareerAgentUsers')
JOBS_TABLE = os.environ.get('JOBS_TABLE', 'CareerAgentJobs')
APPLICATIONS_TABLE = os.environ.get('APPLICATIONS_TABLE', 'CareerAgentApplications')
RESUMES_BUCKET = os.environ.get('RESUMES_BUCKET', 'career-agent-resumes')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler function
    Routes requests based on HTTP method and path
    """
    try:
        # Extract request details
        http_method = event.get('httpMethod', '')
        path = event.get('path', '')
        headers = event.get('headers', {})
        body = json.loads(event.get('body', '{}')) if event.get('body') else {}
        
        logger.info(f"Request: {http_method} {path}")
        
        # CORS headers
        response_headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        }
        
        # Handle OPTIONS for CORS
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': response_headers,
                'body': json.dumps({'message': 'OK'})
            }
        
        # Route to appropriate handler
        if path.startswith('/api/jobs'):
            return handle_jobs_request(http_method, path, body, response_headers)
        elif path.startswith('/api/users'):
            return handle_users_request(http_method, path, body, response_headers)
        elif path.startswith('/api/resume'):
            return handle_resume_request(http_method, path, body, response_headers)
        elif path.startswith('/api/ai'):
            return handle_ai_request(http_method, path, body, response_headers)
        elif path.startswith('/api/applications'):
            return handle_applications_request(http_method, path, body, response_headers)
        elif path.startswith('/api/market-intelligence'):
            return handle_market_intelligence_request(http_method, path, body, response_headers)
        else:
            return {
                'statusCode': 404,
                'headers': response_headers,
                'body': json.dumps({'error': 'Not found'})
            }
            
    except Exception as e:
        logger.error(f"Error in lambda_handler: {str(e)}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': response_headers,
            'body': json.dumps({'error': 'Internal server error', 'message': str(e)})
        }


def handle_jobs_request(method: str, path: str, body: Dict, headers: Dict) -> Dict:
    """Handle job-related requests"""
    from bedrock_integration import get_job_recommendations, calculate_job_score
    
    if method == 'GET':
        # Get job listings with AI scoring
        user_id = body.get('userId')
        if not user_id:
            return error_response(400, 'User ID required', headers)
        
        # Fetch user profile
        users_table = dynamodb.Table(USERS_TABLE)
        user_response = users_table.get_item(Key={'userId': user_id})
        user = user_response.get('Item', {})
        
        # Get AI-powered job recommendations
        jobs = get_job_recommendations(user)
        
        return success_response(jobs, headers)
    
    elif method == 'POST' and '/score' in path:
        # Calculate AI compatibility score for a specific job
        user_id = body.get('userId')
        job_id = body.get('jobId')
        
        if not user_id or not job_id:
            return error_response(400, 'User ID and Job ID required', headers)
        
        score = calculate_job_score(user_id, job_id)
        return success_response({'score': score}, headers)
    
    return error_response(405, 'Method not allowed', headers)


def handle_users_request(method: str, path: str, body: Dict, headers: Dict) -> Dict:
    """Handle user profile requests"""
    users_table = dynamodb.Table(USERS_TABLE)
    
    if method == 'GET':
        user_id = path.split('/')[-1]
        response = users_table.get_item(Key={'userId': user_id})
        user = response.get('Item')
        
        if not user:
            return error_response(404, 'User not found', headers)
        
        return success_response(user, headers)
    
    elif method == 'POST':
        # Create or update user profile
        user_data = body
        user_data['updatedAt'] = datetime.utcnow().isoformat()
        
        users_table.put_item(Item=user_data)
        return success_response(user_data, headers)
    
    elif method == 'PUT':
        # Update user profile
        user_id = body.get('userId')
        if not user_id:
            return error_response(400, 'User ID required', headers)
        
        update_expr = "SET "
        expr_attr_values = {}
        
        for key, value in body.items():
            if key != 'userId':
                update_expr += f"{key} = :{key}, "
                expr_attr_values[f":{key}"] = value
        
        update_expr = update_expr.rstrip(', ')
        
        users_table.update_item(
            Key={'userId': user_id},
            UpdateExpression=update_expr,
            ExpressionAttributeValues=expr_attr_values
        )
        
        return success_response({'message': 'User updated successfully'}, headers)
    
    return error_response(405, 'Method not allowed', headers)


def handle_resume_request(method: str, path: str, body: Dict, headers: Dict) -> Dict:
    """Handle resume upload and analysis requests"""
    from bedrock_integration import analyze_resume, tailor_resume_for_job
    
    if method == 'POST' and '/analyze' in path:
        # Analyze resume using AWS Bedrock
        resume_text = body.get('resumeText')
        user_id = body.get('userId')
        
        if not resume_text:
            return error_response(400, 'Resume text required', headers)
        
        analysis = analyze_resume(resume_text)
        
        # Store analysis results
        if user_id:
            users_table = dynamodb.Table(USERS_TABLE)
            users_table.update_item(
                Key={'userId': user_id},
                UpdateExpression="SET resumeAnalysis = :analysis, updatedAt = :updated",
                ExpressionAttributeValues={
                    ':analysis': analysis,
                    ':updated': datetime.utcnow().isoformat()
                }
            )
        
        return success_response(analysis, headers)
    
    elif method == 'POST' and '/tailor' in path:
        # Tailor resume for specific job
        resume_text = body.get('resumeText')
        job_description = body.get('jobDescription')
        
        if not resume_text or not job_description:
            return error_response(400, 'Resume text and job description required', headers)
        
        tailored_suggestions = tailor_resume_for_job(resume_text, job_description)
        return success_response(tailored_suggestions, headers)
    
    elif method == 'POST' and '/upload' in path:
        # Upload resume to S3
        user_id = body.get('userId')
        file_content = body.get('fileContent')  # Base64 encoded
        file_name = body.get('fileName')
        
        if not all([user_id, file_content, file_name]):
            return error_response(400, 'User ID, file content, and file name required', headers)
        
        # Upload to S3
        s3_key = f"{user_id}/{file_name}"
        s3.put_object(
            Bucket=RESUMES_BUCKET,
            Key=s3_key,
            Body=file_content,
            ContentType='application/pdf'
        )
        
        # Update user record
        users_table = dynamodb.Table(USERS_TABLE)
        users_table.update_item(
            Key={'userId': user_id},
            UpdateExpression="SET resumeUrl = :url, updatedAt = :updated",
            ExpressionAttributeValues={
                ':url': f"s3://{RESUMES_BUCKET}/{s3_key}",
                ':updated': datetime.utcnow().isoformat()
            }
        )
        
        return success_response({'resumeUrl': s3_key}, headers)
    
    return error_response(405, 'Method not allowed', headers)


def handle_ai_request(method: str, path: str, body: Dict, headers: Dict) -> Dict:
    """Handle AI-powered requests (Bedrock integration)"""
    from bedrock_integration import (
        generate_career_roadmap,
        get_market_insights,
        generate_interview_questions
    )
    
    if method == 'POST' and '/career-roadmap' in path:
        current_role = body.get('currentRole')
        target_role = body.get('targetRole')
        skills = body.get('skills', [])
        
        roadmap = generate_career_roadmap(current_role, target_role, skills)
        return success_response(roadmap, headers)
    
    elif method == 'POST' and '/market-insights' in path:
        role = body.get('role')
        location = body.get('location')
        
        insights = get_market_insights(role, location)
        return success_response(insights, headers)
    
    elif method == 'POST' and '/interview-prep' in path:
        job_id = body.get('jobId')
        job_description = body.get('jobDescription')
        
        questions = generate_interview_questions(job_description)
        return success_response({'questions': questions}, headers)
    
    return error_response(405, 'Method not allowed', headers)


def handle_applications_request(method: str, path: str, body: Dict, headers: Dict) -> Dict:
    """Handle job application tracking"""
    applications_table = dynamodb.Table(APPLICATIONS_TABLE)
    
    if method == 'GET':
        user_id = body.get('userId')
        if not user_id:
            return error_response(400, 'User ID required', headers)
        
        response = applications_table.query(
            IndexName='UserIdIndex',
            KeyConditionExpression='userId = :userId',
            ExpressionAttributeValues={':userId': user_id}
        )
        
        return success_response(response.get('Items', []), headers)
    
    elif method == 'POST':
        # Track new application
        application_data = body
        application_data['applicationId'] = f"app_{datetime.utcnow().timestamp()}"
        application_data['appliedAt'] = datetime.utcnow().isoformat()
        application_data['status'] = 'applied'
        
        applications_table.put_item(Item=application_data)
        return success_response(application_data, headers)
    
    elif method == 'PUT':
        # Update application status
        application_id = body.get('applicationId')
        status = body.get('status')
        
        if not application_id or not status:
            return error_response(400, 'Application ID and status required', headers)
        
        applications_table.update_item(
            Key={'applicationId': application_id},
            UpdateExpression="SET #status = :status, updatedAt = :updated",
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': status,
                ':updated': datetime.utcnow().isoformat()
            }
        )
        
        return success_response({'message': 'Application updated'}, headers)
    
    return error_response(405, 'Method not allowed', headers)


def handle_market_intelligence_request(method: str, path: str, body: Dict, headers: Dict) -> Dict:
    """Handle market intelligence data requests"""
    from bedrock_integration import get_salary_trends, get_skill_demand_forecast
    
    if method == 'GET' and '/salary-trends' in path:
        role = body.get('role')
        location = body.get('location')
        
        trends = get_salary_trends(role, location)
        return success_response(trends, headers)
    
    elif method == 'GET' and '/skill-demand' in path:
        skills = body.get('skills', [])
        
        demand_data = get_skill_demand_forecast(skills)
        return success_response(demand_data, headers)
    
    return error_response(405, 'Method not allowed', headers)


def success_response(data: Any, headers: Dict) -> Dict:
    """Create successful response"""
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(data, default=str)
    }


def error_response(status_code: int, message: str, headers: Dict) -> Dict:
    """Create error response"""
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': json.dumps({'error': message})
    }
