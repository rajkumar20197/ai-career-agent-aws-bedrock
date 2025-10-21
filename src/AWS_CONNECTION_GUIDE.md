# 🔌 How to Connect Your AWS Account to This Project

## **Complete Step-by-Step Guide for AWS AI Agent Global Hackathon**

This guide will walk you through **exactly** how to connect your AWS account to the AI Career Agent Platform, even if you've never used AWS before!

---

## 📋 **Table of Contents**

1. [Quick Overview](#quick-overview)
2. [Before You Start - Prerequisites](#before-you-start---prerequisites)
3. [AWS Account Setup](#aws-account-setup)
4. [AWS Bedrock Access (Most Important!)](#aws-bedrock-access-most-important)
5. [AWS CLI Installation & Configuration](#aws-cli-installation--configuration)
6. [Project Setup](#project-setup)
7. [Deploy AWS Infrastructure](#deploy-aws-infrastructure)
8. [Connect Frontend to AWS](#connect-frontend-to-aws)
9. [Test Everything](#test-everything)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 **Quick Overview**

### **What You'll Be Doing:**

```
1. Create AWS Account (if you don't have one)
2. Request AWS Bedrock Access (CRITICAL for AI features!)
3. Install & Configure AWS CLI on your computer
4. Deploy backend infrastructure to AWS (Lambda, DynamoDB, etc.)
5. Connect frontend app to your AWS backend
6. Test the full integration
```

### **Time Required:**
- ⏱️ **First-time setup:** 30-45 minutes
- ⏱️ **If AWS account exists:** 15-20 minutes
- ⏱️ **Bedrock approval wait:** 1-2 hours (AWS approval process)

---

## 🚀 **Before You Start - Prerequisites**

### **1. Software You Need to Install:**

#### **✅ Node.js (JavaScript runtime)**
```bash
# Check if already installed
node --version

# Should be v18.0.0 or higher
# If not installed, download from: https://nodejs.org/
```

#### **✅ Python (for AWS Lambda)**
```bash
# Check version
python3 --version

# Should be 3.11 or higher
# Download from: https://www.python.org/downloads/
```

#### **✅ Git**
```bash
# Check if installed
git --version

# Download from: https://git-scm.com/downloads
```

### **2. Accounts You Need:**
- ✅ AWS Account (we'll create in next section)
- ✅ Credit card (AWS requires, but **free tier is enough**)

---

## 🏦 **AWS Account Setup**

### **Step 1: Create AWS Account (Skip if you have one)**

1. **Go to:** https://aws.amazon.com/
2. **Click:** "Create an AWS Account" (top right)
3. **Fill in:**
   - Email address
   - Password
   - Account name (e.g., "AI Career Agent Hackathon")
4. **Enter:**
   - Contact information
   - Credit card details (for verification - **won't be charged if you stay in free tier**)
   - Phone verification
5. **Select:** "Basic Support - Free" plan
6. **Wait:** 5-10 minutes for account activation

### **Step 2: Sign in to AWS Console**

1. **Go to:** https://console.aws.amazon.com/
2. **Sign in** with your new account
3. **Important:** You should see the AWS Console dashboard

---

## 🤖 **AWS Bedrock Access (MOST IMPORTANT!)**

> **⚠️ CRITICAL:** Without Bedrock access, AI features won't work!

### **Why is Bedrock Important?**
- 🧠 Powers all AI features (job matching, resume analysis, etc.)
- 🎯 Uses Claude 3.5 Haiku for intelligent responses
- 💡 Core technology for the hackathon project

### **Step-by-Step Bedrock Access Request:**

#### **1. Navigate to Bedrock Console**
```
AWS Console → Search "Bedrock" → Click "Amazon Bedrock"
```

#### **2. Request Model Access**
1. **Click:** "Model access" (left sidebar)
2. **Click:** "Request model access" (orange button)
3. **Scroll down** to find **"Anthropic"** section
4. **Check the box** next to:
   - ✅ **"Claude 3.5 Haiku"** (anthropic.claude-3-5-haiku-20241022-v1:0)
5. **Optional but recommended:** Also select:
   - ✅ Claude 3.5 Sonnet
   - ✅ Claude 3 Haiku
6. **Click:** "Request model access" button at bottom
7. **Fill out form:**
   - Use case: "Educational - AI Career Agent for Hackathon"
   - Description: "Building AI-powered career agent platform for AWS Hackathon"
8. **Submit** the request

#### **3. Wait for Approval**
- ⏱️ **Usually takes:** 5 minutes to 2 hours
- 📧 **You'll get email** when approved
- ✅ **Status will change** from "In Progress" to "Access granted"

#### **4. Verify Access (After Approval)**
1. **Go back to:** Bedrock → Model access
2. **Check:** "Claude 3.5 Haiku" shows **"Access granted"** in green

---

## 💻 **AWS CLI Installation & Configuration**

### **Step 1: Install AWS CLI**

#### **For Windows:**
```powershell
# Download installer from:
https://awscli.amazonaws.com/AWSCLIV2.msi

# Run installer
# Verify installation:
aws --version
```

#### **For macOS:**
```bash
# Using Homebrew
brew install awscli

# Or download from:
https://awscli.amazonaws.com/AWSCLIV2.pkg

# Verify
aws --version
```

#### **For Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify
aws --version
```

### **Step 2: Create AWS Access Keys**

#### **In AWS Console:**
1. **Click** your username (top right)
2. **Click:** "Security credentials"
3. **Scroll down** to "Access keys"
4. **Click:** "Create access key"
5. **Select:** "Command Line Interface (CLI)"
6. **Check:** "I understand..." checkbox
7. **Click:** "Next" → "Create access key"
8. **IMPORTANT:** 
   - ✅ **Copy "Access key ID"**
   - ✅ **Copy "Secret access key"**
   - ⚠️ **Save these somewhere safe!** (You can't view secret again)

### **Step 3: Configure AWS CLI**

```bash
# Run this command
aws configure

# It will ask you:

AWS Access Key ID [None]: <PASTE YOUR ACCESS KEY ID>
AWS Secret Access Key [None]: <PASTE YOUR SECRET ACCESS KEY>
Default region name [None]: us-east-1
Default output format [None]: json
```

### **Step 4: Verify Configuration**

```bash
# Test AWS CLI
aws sts get-caller-identity

# Should output something like:
# {
#     "UserId": "AIDXXXXXXXXXXXXXXXXX",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/your-name"
# }
```

✅ **If you see this, you're connected to AWS!**

---

## 📦 **Project Setup**

### **Step 1: Clone/Navigate to Your Project**

```bash
# If you haven't cloned yet
git clone https://github.com/your-repo/ai-career-agent.git
cd ai-career-agent

# Or if you already have the project
cd /path/to/ai-career-agent
```

### **Step 2: Install Frontend Dependencies**

```bash
npm install
```

### **Step 3: Install Backend Dependencies**

```bash
cd backend/lambda
pip install -r requirements.txt
cd ../..
```

### **Step 4: Create Environment File**

```bash
# Copy example environment file
cp config/environment.example.env .env

# Edit the file
nano .env  # or use your favorite editor (VS Code, Notepad++, etc.)
```

### **Step 5: Update .env File**

Open `.env` and update these values:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=<YOUR_12_DIGIT_AWS_ACCOUNT_ID>

# Environment
ENVIRONMENT=dev

# AWS Bedrock
BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
BEDROCK_REGION=us-east-1

# We'll fill in the rest after deployment!
```

**How to find your AWS Account ID:**
```bash
aws sts get-caller-identity --query Account --output text
```

---

## 🚀 **Deploy AWS Infrastructure**

### **Method 1: Automated Deployment (RECOMMENDED)**

This script will deploy everything automatically!

#### **For Mac/Linux:**

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to AWS
./scripts/deploy.sh dev us-east-1
```

#### **For Windows (PowerShell):**

```powershell
# Run deployment script
.\scripts\deploy.ps1 -Environment dev -Region us-east-1
```

### **What This Deploys:**

The script creates:
- ✅ Lambda functions (API backend)
- ✅ DynamoDB tables (database)
- ✅ S3 buckets (file storage)
- ✅ API Gateway (REST API)
- ✅ Cognito User Pool (authentication)
- ✅ IAM roles (permissions)
- ✅ CloudWatch alarms (monitoring)

**⏱️ This takes 5-10 minutes.**

### **Expected Output:**

```bash
Creating CloudFormation stack...
✓ Stack creation initiated: dev-career-agent-stack

Waiting for stack to complete (this may take 5-10 minutes)...
✓ Lambda function created
✓ DynamoDB tables created
✓ API Gateway deployed
✓ Cognito User Pool created

Deployment Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stack Name:      dev-career-agent-stack
Region:          us-east-1
API Endpoint:    https://abc123.execute-api.us-east-1.amazonaws.com/dev
User Pool ID:    us-east-1_ABC123XYZ
Client ID:       abc123xyz456789
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Deployment successful!
```

### **Save These Values!**

Copy the output values - you'll need them in the next step:
- ✅ API Endpoint
- ✅ User Pool ID
- ✅ Client ID

---

### **Method 2: Manual Deployment (If script fails)**

<details>
<summary>Click to expand manual deployment steps</summary>

#### **1. Create S3 Bucket for Lambda Code**

```bash
# Get your AWS Account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create bucket name
export LAMBDA_BUCKET="dev-career-agent-lambda-${AWS_ACCOUNT_ID}"

# Create bucket
aws s3 mb s3://${LAMBDA_BUCKET} --region us-east-1
```

#### **2. Package Lambda Function**

```bash
cd backend/lambda

# Create package directory
mkdir -p package
pip install -r requirements.txt -t package/

# Copy Lambda code
cp index.py package/
cp bedrock_integration.py package/

# Create ZIP
cd package
zip -r ../lambda-deployment.zip .
cd ..
zip -g lambda-deployment.zip index.py bedrock_integration.py

# Upload to S3
aws s3 cp lambda-deployment.zip s3://${LAMBDA_BUCKET}/

cd ../..
```

#### **3. Deploy CloudFormation Stack**

```bash
aws cloudformation create-stack \
  --stack-name dev-career-agent-stack \
  --template-body file://infrastructure/cloudformation-template.yaml \
  --parameters ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1

# Wait for completion (5-10 minutes)
aws cloudformation wait stack-create-complete \
  --stack-name dev-career-agent-stack \
  --region us-east-1
```

#### **4. Get Stack Outputs**

```bash
# API Endpoint
aws cloudformation describe-stacks \
  --stack-name dev-career-agent-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' \
  --output text

# User Pool ID
aws cloudformation describe-stacks \
  --stack-name dev-career-agent-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
  --output text

# Client ID
aws cloudformation describe-stacks \
  --stack-name dev-career-agent-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
  --output text
```

</details>

---

## 🔗 **Connect Frontend to AWS**

### **Step 1: Update .env File**

Open your `.env` file and add the values from deployment:

```env
# Frontend Configuration
VITE_API_URL=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/dev
VITE_USER_POOL_ID=us-east-1_YOUR_POOL_ID
VITE_USER_POOL_CLIENT_ID=YOUR_CLIENT_ID
VITE_AWS_REGION=us-east-1
```

**Replace:**
- `YOUR_API_ID` → From deployment output
- `YOUR_POOL_ID` → From deployment output
- `YOUR_CLIENT_ID` → From deployment output

### **Step 2: Update bedrockService.ts to Use Real AWS**

Currently the app uses mock data. Let's connect it to real AWS Bedrock!

Create a new file: `/services/awsBedrockService.ts`

```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ 
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1' 
});

export async function callBedrock(prompt: string): Promise<string> {
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-5-haiku-20241022-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.content[0].text;
}
```

### **Step 3: Install AWS SDK**

```bash
npm install @aws-sdk/client-bedrock-runtime @aws-sdk/credential-providers
```

---

## ✅ **Test Everything**

### **Test 1: Start Development Server**

```bash
npm run dev
```

**Expected:** Server starts at http://localhost:5173

### **Test 2: Test AWS Connection**

Open browser console and run:

```javascript
// Test API endpoint
fetch(import.meta.env.VITE_API_URL + '/health')
  .then(r => r.json())
  .then(console.log);

// Expected output: { status: "ok" }
```

### **Test 3: Create Test User**

```bash
# Replace with values from your deployment
USER_POOL_ID="us-east-1_YOUR_POOL_ID"
CLIENT_ID="YOUR_CLIENT_ID"

# Create test user
aws cognito-idp sign-up \
  --client-id ${CLIENT_ID} \
  --username test@example.com \
  --password TestPassword123! \
  --user-attributes Name=email,Value=test@example.com

# Confirm user (admin action for testing)
aws cognito-idp admin-confirm-sign-up \
  --user-pool-id ${USER_POOL_ID} \
  --username test@example.com
```

### **Test 4: Full Application Test**

1. **Open:** http://localhost:5173
2. **Click:** "Get Started"
3. **Login** with test@example.com / TestPassword123!
4. **Complete** onboarding
5. **Test features:**
   - ✅ Job search with AI matching
   - ✅ Resume upload and analysis
   - ✅ Market intelligence
   - ✅ Settings

---

## 🎯 **Verify AWS Integration**

### **Check CloudWatch Logs:**

```bash
# View Lambda logs
aws logs tail /aws/lambda/dev-CareerAgentAPI --follow
```

### **Check DynamoDB Tables:**

```bash
# List tables
aws dynamodb list-tables

# Should show:
# - dev-CareerAgentUsers
# - dev-CareerAgentJobs
# - dev-CareerAgentApplications
```

### **Check S3 Buckets:**

```bash
# List buckets
aws s3 ls | grep career-agent

# Should show your buckets
```

### **Check API Gateway:**

```bash
# Test health endpoint
curl https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/dev/health

# Expected: {"status":"ok"}
```

---

## 🐛 **Troubleshooting**

### **Issue 1: "Bedrock Access Denied"**

**Error:**
```
AccessDeniedException: User is not authorized to perform bedrock:InvokeModel
```

**Solution:**
1. ✅ Check Bedrock model access is **"Access granted"** in console
2. ✅ Wait for approval email (can take up to 2 hours)
3. ✅ Verify you're using correct region (us-east-1)
4. ✅ Verify IAM role has Bedrock permissions

**Check access:**
```bash
aws bedrock list-foundation-models --region us-east-1
```

---

### **Issue 2: "AWS CLI Not Configured"**

**Error:**
```
The config profile (default) could not be found
```

**Solution:**
```bash
# Reconfigure AWS CLI
aws configure

# Enter your access keys again
```

---

### **Issue 3: "CloudFormation Stack Failed"**

**Error:**
```
CREATE_FAILED
```

**Solution:**
```bash
# Check what failed
aws cloudformation describe-stack-events \
  --stack-name dev-career-agent-stack \
  --max-items 20

# Delete failed stack
aws cloudformation delete-stack \
  --stack-name dev-career-agent-stack

# Wait for deletion
aws cloudformation wait stack-delete-complete \
  --stack-name dev-career-agent-stack

# Try deploying again
./scripts/deploy.sh dev us-east-1
```

---

### **Issue 4: "CORS Error in Browser"**

**Error:**
```
Access-Control-Allow-Origin header is missing
```

**Solution:**

Update Lambda function to return CORS headers:

```python
# In backend/lambda/index.py
return {
    'statusCode': 200,
    'headers': {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    'body': json.dumps(response)
}
```

---

### **Issue 5: "Bedrock Model Not Available"**

**Error:**
```
ValidationException: The model ID is invalid
```

**Solution:**

Check available models:
```bash
aws bedrock list-foundation-models \
  --region us-east-1 \
  --query 'modelSummaries[?contains(modelId, `claude`)].{ID:modelId,Name:modelName}'
```

Use exact model ID from output.

---

## 📊 **AWS Cost Estimate**

### **Free Tier Usage (First 12 Months):**
- ✅ Lambda: 1M requests/month FREE
- ✅ DynamoDB: 25GB storage FREE
- ✅ S3: 5GB storage FREE
- ✅ API Gateway: 1M API calls/month FREE
- ✅ Cognito: 50,000 MAUs FREE

### **Bedrock Costs (NOT Free):**
- Claude 3.5 Haiku: $0.25 per 1M input tokens
- Claude 3.5 Haiku: $1.25 per 1M output tokens

**Estimated hackathon cost:** $1-5 for testing and demos

### **To Stay in Free Tier:**
1. ✅ Delete resources after hackathon
2. ✅ Use mock data for development
3. ✅ Only test with Bedrock when necessary

---

## 🎬 **Quick Start Commands Summary**

```bash
# 1. Configure AWS
aws configure

# 2. Deploy infrastructure
./scripts/deploy.sh dev us-east-1

# 3. Update .env with outputs from deployment

# 4. Install dependencies
npm install

# 5. Start app
npm run dev

# 6. Test at http://localhost:5173
```

---

## 🎯 **Next Steps**

After AWS is connected:

1. ✅ **Test all features** with real AWS Bedrock
2. ✅ **Customize AI prompts** for better responses
3. ✅ **Add real job data** from APIs
4. ✅ **Implement Gmail integration** (optional)
5. ✅ **Deploy frontend** to Vercel/Netlify
6. ✅ **Create demo video** for hackathon
7. ✅ **Submit project** before deadline (Oct 22, 2025)

---

## 📚 **Helpful Resources**

- **AWS Bedrock Docs:** https://docs.aws.amazon.com/bedrock/
- **AWS CLI Docs:** https://docs.aws.amazon.com/cli/
- **CloudFormation Docs:** https://docs.aws.amazon.com/cloudformation/
- **AWS Free Tier:** https://aws.amazon.com/free/

---

## ❓ **Need Help?**

### **Check Logs:**
```bash
# Lambda logs
aws logs tail /aws/lambda/dev-CareerAgentAPI --follow

# CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name dev-career-agent-stack
```

### **AWS Support:**
- AWS Console → Support Center
- AWS Developer Forums
- Stack Overflow (tag: aws-bedrock)

---

## ✅ **Checklist: Are You Connected?**

- [ ] AWS Account created
- [ ] AWS CLI installed and configured
- [ ] Bedrock access approved for Claude 3.5 Haiku
- [ ] CloudFormation stack deployed successfully
- [ ] API endpoint working (returns {"status":"ok"})
- [ ] Frontend .env file updated with AWS values
- [ ] Test user created in Cognito
- [ ] Can login to application
- [ ] AI features working with real Bedrock

**If all checked, you're ready for the hackathon! 🎉**

---

## 🏆 **For the Hackathon**

### **Demo Tips:**
1. ✅ Show real AWS Bedrock integration
2. ✅ Demonstrate AI-powered job matching
3. ✅ Show resume analysis with Bedrock
4. ✅ Highlight serverless architecture
5. ✅ Explain cost optimization with AWS Free Tier

### **Presentation Points:**
- **"Powered by AWS Bedrock Claude 3.5 Haiku"**
- **"Fully serverless architecture"**
- **"Production-ready with CloudFormation IaC"**
- **"Scalable with DynamoDB and Lambda"**
- **"Secure with Cognito authentication"**

---

**You're now connected to AWS! Good luck with the hackathon! 🚀**

*Last updated: October 21, 2025*
