# 🚀 AI Career Agent Platform - Deployment Guide

## Complete Step-by-Step Deployment Instructions

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Account Setup](#aws-account-setup)
3. [Local Development Setup](#local-development-setup)
4. [AWS Infrastructure Deployment](#aws-infrastructure-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Testing the Deployment](#testing-the-deployment)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

✅ **Node.js and npm**
```bash
# Check if installed
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0

# Install from https://nodejs.org/
```

✅ **Python 3.11+**
```bash
# Check if installed
python3 --version  # Should be >= 3.11.0

# Install from https://www.python.org/downloads/
```

✅ **AWS CLI**
```bash
# Check if installed
aws --version

# Install: https://aws.amazon.com/cli/
```

✅ **Git**
```bash
git --version
```

### AWS Account Requirements

- Active AWS Account
- AWS CLI configured with credentials
- Sufficient IAM permissions for:
  - Lambda, DynamoDB, S3, Cognito, API Gateway
  - CloudFormation, IAM, CloudWatch
  - AWS Bedrock (requires model access approval)

---

## AWS Account Setup

### Step 1: Request AWS Bedrock Access

1. Go to **AWS Console** → **Amazon Bedrock**
2. Navigate to **Model access** in the left sidebar
3. Click **"Request model access"**
4. Select **"Anthropic Claude 3.5 Haiku"**
5. Fill out the form and submit request
6. Wait for approval (usually 1-2 hours)

### Step 2: Configure AWS CLI

```bash
aws configure

# Enter the following when prompted:
AWS Access Key ID: YOUR_ACCESS_KEY
AWS Secret Access Key: YOUR_SECRET_KEY
Default region name: us-east-1
Default output format: json
```

### Step 3: Verify AWS Credentials

```bash
# Check current identity
aws sts get-caller-identity

# Should output your AWS Account ID and ARN
```

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/your-org/ai-career-agent.git
cd ai-career-agent
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend/lambda
pip install -r requirements.txt
cd ../..
```

### Step 4: Configure Environment Variables

```bash
# Copy example environment file
cp config/environment.example.env config/.env.dev

# Edit the file with your settings
nano config/.env.dev
```

Required variables:
```env
AWS_REGION=us-east-1
ENVIRONMENT=dev
BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
```

---

## AWS Infrastructure Deployment

### Method 1: Automated Deployment (Recommended)

#### For Linux/Mac:

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to development environment
./scripts/deploy.sh dev us-east-1

# Deploy to production (when ready)
./scripts/deploy.sh prod us-east-1
```

#### For Windows (PowerShell):

```powershell
# Deploy to development environment
.\scripts\deploy.ps1 -Environment dev -Region us-east-1

# Deploy to production (when ready)
.\scripts\deploy.ps1 -Environment prod -Region us-east-1
```

### Method 2: Manual Deployment

#### Step 1: Create Lambda Deployment Package

```bash
cd backend/lambda

# Create package directory
mkdir -p package
pip install -r requirements.txt -t package/

# Copy Lambda code
cp index.py package/
cp bedrock_integration.py package/

# Create ZIP file
cd package
zip -r ../lambda-deployment.zip .
cd ..
zip -g lambda-deployment.zip index.py bedrock_integration.py

cd ../..
```

#### Step 2: Create S3 Bucket for Lambda Code

```bash
# Replace YOUR_ACCOUNT_ID with your AWS account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export LAMBDA_BUCKET="dev-career-agent-lambda-${AWS_ACCOUNT_ID}"

# Create bucket
aws s3 mb s3://${LAMBDA_BUCKET} --region us-east-1

# Upload Lambda package
aws s3 cp backend/lambda/lambda-deployment.zip s3://${LAMBDA_BUCKET}/
```

#### Step 3: Deploy CloudFormation Stack

```bash
aws cloudformation create-stack \
  --stack-name dev-career-agent-stack \
  --template-body file://infrastructure/cloudformation-template.yaml \
  --parameters ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1

# Monitor stack creation
aws cloudformation wait stack-create-complete \
  --stack-name dev-career-agent-stack \
  --region us-east-1

# This will take 5-10 minutes
```

#### Step 4: Update Lambda Function Code

```bash
aws lambda update-function-code \
  --function-name dev-CareerAgentAPI \
  --s3-bucket ${LAMBDA_BUCKET} \
  --s3-key lambda-deployment.zip \
  --region us-east-1
```

#### Step 5: Get Stack Outputs

```bash
# Get API endpoint
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name dev-career-agent-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' \
  --output text)

echo "API Endpoint: ${API_ENDPOINT}"

# Get Cognito User Pool ID
USER_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name dev-career-agent-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
  --output text)

echo "User Pool ID: ${USER_POOL_ID}"

# Get Cognito User Pool Client ID
USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks \
  --stack-name dev-career-agent-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
  --output text)

echo "User Pool Client ID: ${USER_POOL_CLIENT_ID}"
```

---

## Frontend Deployment

### Step 1: Update Frontend Environment Variables

Create `.env` file in the project root:

```env
VITE_API_URL=YOUR_API_ENDPOINT_FROM_ABOVE
VITE_USER_POOL_ID=YOUR_USER_POOL_ID
VITE_USER_POOL_CLIENT_ID=YOUR_USER_POOL_CLIENT_ID
VITE_AWS_REGION=us-east-1
```

### Step 2: Test Locally

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Step 3: Build for Production

```bash
npm run build
```

### Step 4: Deploy Frontend

#### Option A: Deploy to S3 + CloudFront

```bash
# Create S3 bucket for frontend
aws s3 mb s3://career-agent-frontend-YOUR_ACCOUNT_ID

# Enable static website hosting
aws s3 website s3://career-agent-frontend-YOUR_ACCOUNT_ID/ \
  --index-document index.html \
  --error-document index.html

# Sync built files
aws s3 sync dist/ s3://career-agent-frontend-YOUR_ACCOUNT_ID/ \
  --delete \
  --cache-control "public, max-age=31536000"

# Make bucket public (for static hosting)
aws s3api put-bucket-policy \
  --bucket career-agent-frontend-YOUR_ACCOUNT_ID \
  --policy file://s3-bucket-policy.json
```

#### Option B: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option C: Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

---

## Testing the Deployment

### Step 1: Create Test User

```bash
aws cognito-idp sign-up \
  --client-id ${USER_POOL_CLIENT_ID} \
  --username test@example.com \
  --password TestPassword123! \
  --user-attributes Name=name,Value="Test User" Name=email,Value=test@example.com

# Confirm user (admin action for testing)
aws cognito-idp admin-confirm-sign-up \
  --user-pool-id ${USER_POOL_ID} \
  --username test@example.com
```

### Step 2: Test API Endpoints

```bash
# Test health check
curl ${API_ENDPOINT}/health

# Should return: {"status": "ok"}
```

### Step 3: Test Frontend

1. Open your deployed frontend URL
2. Sign up with a new account
3. Complete onboarding
4. Test all features:
   - Job search
   - Resume upload
   - Market intelligence
   - Settings

---

## Post-Deployment Configuration

### Step 1: Configure CORS

Update API Gateway CORS settings if needed:

```bash
aws apigateway update-rest-api \
  --rest-api-id YOUR_API_ID \
  --patch-operations \
    op=replace,path=/cors/allowOrigins,value=https://your-frontend-domain.com
```

### Step 2: Set Up CloudWatch Alarms

The CloudFormation template creates basic alarms. You can add more:

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name career-agent-high-lambda-duration \
  --alarm-description "Alert when Lambda duration is high" \
  --metric-name Duration \
  --namespace AWS/Lambda \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 5000 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=dev-CareerAgentAPI
```

### Step 3: Enable API Gateway Logging

```bash
# Create CloudWatch log group
aws logs create-log-group \
  --log-group-name /aws/apigateway/career-agent-api

# Enable access logging on API Gateway stage
aws apigateway update-stage \
  --rest-api-id YOUR_API_ID \
  --stage-name dev \
  --patch-operations \
    op=replace,path=/accessLogSettings/destinationArn,value=arn:aws:logs:REGION:ACCOUNT_ID:log-group:/aws/apigateway/career-agent-api
```

---

## Troubleshooting

### Issue: Bedrock Access Denied

**Error:** `AccessDeniedException: User is not authorized to perform bedrock:InvokeModel`

**Solution:**
1. Check that Bedrock model access is approved in AWS Console
2. Verify Lambda execution role has Bedrock permissions
3. Ensure you're using the correct model ID

### Issue: Lambda Timeout

**Error:** `Task timed out after 30.00 seconds`

**Solution:**
```bash
# Increase Lambda timeout
aws lambda update-function-configuration \
  --function-name dev-CareerAgentAPI \
  --timeout 60
```

### Issue: DynamoDB Throttling

**Error:** `ProvisionedThroughputExceededException`

**Solution:**
- Tables are set to PAY_PER_REQUEST mode (no throttling)
- If you changed to PROVISIONED mode, increase read/write capacity

### Issue: CORS Errors

**Error:** `Access to fetch at 'API_URL' from origin 'FRONTEND_URL' has been blocked by CORS`

**Solution:**
1. Check API Gateway CORS configuration
2. Ensure Lambda returns proper CORS headers
3. Update `Access-Control-Allow-Origin` in Lambda response

### Issue: CloudFormation Stack Creation Failed

**Solution:**
```bash
# Check stack events for errors
aws cloudformation describe-stack-events \
  --stack-name dev-career-agent-stack \
  --max-items 20

# Delete failed stack
aws cloudformation delete-stack \
  --stack-name dev-career-agent-stack

# Fix issues and redeploy
```

### Get Help

- Check CloudWatch Logs for Lambda errors
- Review CloudFormation stack events
- Check IAM role permissions
- Verify all AWS service quotas

---

## Next Steps

✅ Set up custom domain name  
✅ Configure SSL certificate  
✅ Set up CI/CD pipeline with GitHub Actions  
✅ Enable AWS X-Ray tracing  
✅ Set up monitoring dashboards  
✅ Configure backup and disaster recovery  

---

**Deployment complete! 🎉**

Your AI Career Agent Platform is now live and ready to use!
