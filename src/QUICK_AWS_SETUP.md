# ⚡ Quick AWS Setup - One-Page Reference

## **For the Busy Hackathon Developer 🏃‍♂️**

> **Deadline:** October 22, 2025  
> **Goal:** Connect AWS to your AI Career Agent Platform  
> **Time needed:** 20-30 minutes (+ 1-2 hours for Bedrock approval)

---

## 🎯 **The 5-Step Process**

```
1. AWS Account Setup        → 5 minutes
2. Bedrock Access Request   → 5 minutes (+ wait 1-2 hours for approval)
3. AWS CLI Configuration    → 5 minutes
4. Deploy Infrastructure    → 10 minutes
5. Connect Frontend         → 5 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 30 minutes + Bedrock approval wait
```

---

## 📝 **Step-by-Step Commands**

### **1️⃣ AWS Account Setup**

```bash
# Go to: https://aws.amazon.com/
# Click: "Create AWS Account"
# Follow wizard → Enter credit card (won't be charged)
# Wait 5-10 minutes for activation
```

---

### **2️⃣ Request Bedrock Access (CRITICAL!)**

```bash
# In AWS Console:
1. Search "Bedrock" → Click "Amazon Bedrock"
2. Click "Model access" (left sidebar)
3. Click "Request model access" (orange button)
4. Find "Anthropic" → Check "Claude 3.5 Haiku"
5. Fill form: Use case = "AWS Hackathon - AI Career Agent"
6. Submit → Wait for approval email (1-2 hours)
```

**⚠️ Don't skip this! AI features won't work without Bedrock access.**

---

### **3️⃣ Install & Configure AWS CLI**

#### **Install:**

**Mac:**
```bash
brew install awscli
```

**Windows:**
```powershell
# Download from:
https://awscli.amazonaws.com/AWSCLIV2.msi
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

#### **Get Access Keys:**

```bash
# In AWS Console:
1. Click your name (top right) → "Security credentials"
2. Scroll to "Access keys" → "Create access key"
3. Select "CLI" → Check "I understand" → Next → Create
4. SAVE BOTH KEYS! (Can't view secret key again)
```

#### **Configure CLI:**

```bash
aws configure

# Enter when prompted:
AWS Access Key ID: <PASTE ACCESS KEY>
AWS Secret Access Key: <PASTE SECRET KEY>
Default region name: us-east-1
Default output format: json
```

#### **Verify:**

```bash
aws sts get-caller-identity

# Should show your account info ✅
```

---

### **4️⃣ Deploy AWS Infrastructure**

```bash
# Navigate to project
cd /path/to/ai-career-agent

# Install dependencies
npm install
cd backend/lambda && pip install -r requirements.txt && cd ../..

# Deploy to AWS (automated script)
chmod +x scripts/deploy.sh
./scripts/deploy.sh dev us-east-1

# ⏱️ Wait 5-10 minutes for deployment...
```

#### **Expected Output:**

```bash
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

**📋 SAVE THESE VALUES!** You need them in the next step.

---

### **5️⃣ Connect Frontend to AWS**

#### **Update .env file:**

```bash
# Copy example
cp config/environment.example.env .env

# Edit with your values
nano .env  # or use VS Code/your favorite editor
```

#### **Add these values to .env:**

```env
# Replace with YOUR values from deployment output

VITE_API_URL=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/dev
VITE_USER_POOL_ID=us-east-1_YOUR_POOL_ID
VITE_USER_POOL_CLIENT_ID=YOUR_CLIENT_ID
VITE_AWS_REGION=us-east-1

AWS_REGION=us-east-1
ENVIRONMENT=dev
BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
```

#### **Start the app:**

```bash
npm run dev
```

Open: http://localhost:5173

---

## ✅ **Quick Test Checklist**

```bash
# 1. Test API endpoint
curl https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/dev/health
# Expected: {"status":"ok"}

# 2. Create test user
aws cognito-idp sign-up \
  --client-id YOUR_CLIENT_ID \
  --username test@example.com \
  --password TestPassword123!

# 3. Confirm user
aws cognito-idp admin-confirm-sign-up \
  --user-pool-id YOUR_POOL_ID \
  --username test@example.com

# 4. Test login at http://localhost:5173
# Email: test@example.com
# Password: TestPassword123!
```

---

## 🎯 **What Gets Deployed to AWS**

| Service | Purpose | Cost |
|---------|---------|------|
| **Lambda** | API backend | FREE (1M requests/month) |
| **DynamoDB** | Database | FREE (25GB) |
| **S3** | File storage | FREE (5GB) |
| **API Gateway** | REST API | FREE (1M calls/month) |
| **Cognito** | Authentication | FREE (50K users) |
| **Bedrock** | AI (Claude 3.5) | ~$1-5 for hackathon |
| **CloudWatch** | Monitoring | FREE tier included |

**Total hackathon cost: ~$1-5** (mostly Bedrock usage)

---

## 🐛 **Common Issues & Quick Fixes**

### **Issue:** "Bedrock Access Denied"

```bash
# Check access status
aws bedrock list-foundation-models --region us-east-1

# If empty, Bedrock access not approved yet
# Solution: Wait for approval email (1-2 hours)
```

---

### **Issue:** "AWS CLI not configured"

```bash
# Reconfigure
aws configure

# Re-enter your access keys
```

---

### **Issue:** "Stack creation failed"

```bash
# Check what failed
aws cloudformation describe-stack-events \
  --stack-name dev-career-agent-stack \
  --max-items 10

# Delete and retry
aws cloudformation delete-stack --stack-name dev-career-agent-stack
# Wait 2 minutes, then redeploy
./scripts/deploy.sh dev us-east-1
```

---

### **Issue:** "CORS error in browser"

**Solution:** Already handled in CloudFormation template!  
If still happening, check Lambda returns CORS headers.

---

## 📊 **Architecture You're Deploying**

```
┌─────────────┐
│   Browser   │
│  (React +   │
│  Tailwind)  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  API Gateway    │ ← HTTPS REST API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Lambda         │ ← Python 3.11
│  (API Logic)    │
└────┬───────┬────┘
     │       │
     ▼       ▼
┌─────────┐ ┌──────────────┐
│DynamoDB │ │ AWS Bedrock  │
│(Tables) │ │ (Claude 3.5) │
└─────────┘ └──────────────┘
     │
     ▼
┌─────────┐
│   S3    │ ← Resume storage
└─────────┘
```

---

## 🎬 **Final Verification**

**Run these commands to verify everything works:**

```bash
# 1. AWS connection
aws sts get-caller-identity
# ✅ Should show your account

# 2. Bedrock access
aws bedrock list-foundation-models --region us-east-1 | grep claude
# ✅ Should show Claude models

# 3. Stack deployed
aws cloudformation describe-stacks --stack-name dev-career-agent-stack
# ✅ Status: CREATE_COMPLETE

# 4. API working
curl $(aws cloudformation describe-stacks \
  --stack-name dev-career-agent-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' \
  --output text)/health
# ✅ Returns: {"status":"ok"}

# 5. Frontend running
npm run dev
# ✅ Opens at http://localhost:5173
```

**If all pass ✅ → You're ready for the hackathon!**

---

## 💡 **Pro Tips for Hackathon**

### **1. Demo Script:**
```
"Our platform uses AWS Bedrock's Claude 3.5 Haiku for intelligent 
job matching and resume analysis. The serverless architecture 
ensures zero infrastructure management and automatic scaling."
```

### **2. Show AWS Console:**
- DynamoDB tables with real data
- Lambda function logs (CloudWatch)
- Bedrock model access
- API Gateway endpoints

### **3. Highlight:**
- ✅ Real AWS integration (not mock)
- ✅ Production-ready infrastructure
- ✅ CloudFormation IaC
- ✅ Serverless & scalable
- ✅ Cost-optimized (AWS Free Tier)

---

## 📚 **Get More Help**

- **Full Guide:** See `/AWS_CONNECTION_GUIDE.md` (detailed version)
- **Deployment:** See `/DEPLOYMENT_GUIDE.md`
- **Troubleshooting:** Check CloudWatch logs
- **AWS Docs:** https://docs.aws.amazon.com/bedrock/

---

## 🎯 **Critical Path for Hackathon**

```
TODAY (Oct 21):
1. ✅ Request Bedrock access (FIRST THING!)
2. ✅ While waiting, deploy infrastructure
3. ✅ Test with mock data if Bedrock not approved yet
4. ✅ Once Bedrock approved, connect real AI

TOMORROW (Oct 22 - DEADLINE):
1. ✅ Final testing with real Bedrock
2. ✅ Record demo video
3. ✅ Submit before deadline!
```

---

## 🚀 **Ready to Deploy?**

```bash
# One-liner to get started:
cd ai-career-agent && \
npm install && \
chmod +x scripts/deploy.sh && \
./scripts/deploy.sh dev us-east-1
```

**After deployment, update `.env` and you're DONE! 🎉**

---

**Questions? Check `/AWS_CONNECTION_GUIDE.md` for the full detailed guide!**

*Good luck with the hackathon! 🏆*
