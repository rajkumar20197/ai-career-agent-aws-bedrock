# 🏗️ AI Career Agent Platform - Technical Architecture

## System Architecture Overview

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Component Details](#component-details)
3. [Data Flow](#data-flow)
4. [Security Architecture](#security-architecture)
5. [Scalability & Performance](#scalability--performance)
6. [Disaster Recovery](#disaster-recovery)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           React Frontend (TypeScript + Tailwind)              │  │
│  │  • Landing Page  • Dashboard  • Job Search  • Resume Tool    │  │
│  │  • Market Intelligence  • Gmail Integration  • Settings      │  │
│  └─────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────┼────────────────────────────────────┘
                                  │
                        HTTPS (TLS 1.2+)
                                  │
┌────────────────────────────────┼────────────────────────────────────┐
│                    API GATEWAY LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Amazon API Gateway (REST)                        │  │
│  │  • Request Validation  • Rate Limiting  • CORS               │  │
│  │  • Authentication (Cognito Authorizer)                       │  │
│  │  • Request/Response Transformation                           │  │
│  └─────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────┼────────────────────────────────────┘
                                  │
                           Lambda Proxy
                                  │
┌────────────────────────────────┼────────────────────────────────────┐
│                    COMPUTE LAYER                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         AWS Lambda Functions (Python 3.11)                    │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  index.py (Main Handler)                               │  │  │
│  │  │  • Request routing                                     │  │  │
│  │  │  • Response formatting                                 │  │  │
│  │  │  • Error handling                                      │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  bedrock_integration.py (AI Features)                  │  │  │
│  │  │  • Resume analysis                                     │  │  │
│  │  │  • Job matching                                        │  │  │
│  │  │  • Career roadmap generation                          │  │  │
│  │  │  • Market insights                                     │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────┬──────────────┬────────────┬──────────┬────────┘  │
└─────────────────┼──────────────┼────────────┼──────────┼───────────┘
                  │              │            │          │
                  ▼              ▼            ▼          ▼
     ┌─────────────────┐  ┌──────────┐  ┌────────┐  ┌─────────┐
     │   AWS Bedrock   │  │ DynamoDB │  │   S3   │  │Cognito  │
     │  Claude 3.5     │  │  Tables  │  │ Bucket │  │User Pool│
     │    Haiku        │  └──────────┘  └────────┘  └─────────┘
     └─────────────────┘
              │
     ┌────────┴─────────┐
     │  AI Models:      │
     │  • Text Analysis │
     │  • Generation    │
     │  • Reasoning     │
     └──────────────────┘
```

---

## Component Details

### 1. Frontend Layer (React + TypeScript)

**Technology Stack:**
- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Recharts for data visualization
- Vite for build tooling

**Key Components:**

```typescript
├── App.tsx                      # Main app with routing
├── components/
│   ├── LandingPage.tsx         # Marketing page
│   ├── Onboarding.tsx          # Multi-step onboarding
│   ├── JobSearchDashboard.tsx  # Job search with AI scoring
│   ├── ResumeOptimizer.tsx     # Resume analysis UI
│   ├── MarketIntelligence.tsx  # Market data visualization
│   ├── GmailIntegration.tsx    # Email & calendar UI
│   └── SettingsPage.tsx        # User preferences
```

**State Management:**
- React Hooks (useState, useEffect)
- Component-level state
- Props drilling for shared state

**Routing:**
- Client-side routing
- Navigation state management
- Protected routes with authentication

---

### 2. API Gateway Layer

**Configuration:**
```yaml
Type: REST API
Authentication: Cognito User Pools
Rate Limiting: 1000 req/min per user
Throttling: 10,000 req/second (burst)
CORS: Enabled for frontend origins
Logging: CloudWatch access logs
```

**Endpoints:**
```
/api/jobs              - Job search and recommendations
/api/users             - User profile management
/api/resume            - Resume upload and analysis
/api/ai                - AI-powered features
/api/applications      - Application tracking
/api/market-intelligence - Market data
```

---

### 3. Lambda Functions (Python 3.11)

#### Main Handler (index.py)

**Responsibilities:**
- HTTP request routing
- Request validation
- Response formatting
- Error handling
- CORS headers

**Function Configuration:**
```yaml
Runtime: Python 3.11
Memory: 512 MB
Timeout: 30 seconds
Environment Variables:
  - USERS_TABLE
  - JOBS_TABLE
  - APPLICATIONS_TABLE
  - RESUMES_BUCKET
  - BEDROCK_MODEL_ID
```

#### Bedrock Integration (bedrock_integration.py)

**AI Features:**

1. **Resume Analysis**
   ```python
   analyze_resume(resume_text) -> {
       atsScore: int,
       strengths: List[str],
       weaknesses: List[str],
       suggestions: List[str]
   }
   ```

2. **Job Compatibility Scoring**
   ```python
   calculate_job_score(user_id, job_id) -> int  # 0-100
   ```

3. **Career Roadmap Generation**
   ```python
   generate_career_roadmap(current_role, target_role, skills) -> {
       timeline: str,
       requiredSkills: List[Dict],
       milestones: List[Dict]
   }
   ```

4. **Market Insights**
   ```python
   get_market_insights(role, location) -> {
       demandLevel: str,
       averageSalary: int,
       trends: List[str]
   }
   ```

---

### 4. Data Layer

#### DynamoDB Tables

**UsersTable**
```
Partition Key: userId (String)
Attributes:
  - name, email, careerStage
  - skills: List
  - preferences: Map
  - resumeUrl: String
  - createdAt, updatedAt
Global Secondary Index:
  - EmailIndex: email (Hash)
```

**JobsTable**
```
Partition Key: jobId (String)
Attributes:
  - title, company, location
  - requirements: List
  - salary: Map
  - source: String
  - aiScore: Number
  - postedDate: String
GSI:
  - SourceDateIndex: source (Hash), postedDate (Range)
```

**ApplicationsTable**
```
Partition Key: applicationId (String)
Attributes:
  - userId, jobId
  - status: String
  - appliedAt: String
  - notes: String
GSI:
  - UserIdIndex: userId (Hash), appliedAt (Range)
```

#### S3 Buckets

**ResumesBucket**
```
Structure: /{userId}/{filename}
Encryption: AES-256 (SSE-S3)
Versioning: Enabled
Lifecycle: 90 days for old versions
Access: Private (IAM roles only)
```

---

### 5. AI Layer (AWS Bedrock)

**Model Configuration:**
```yaml
Model: anthropic.claude-3-5-haiku-20241022-v1:0
Max Tokens: 2000-3000 (varies by use case)
Temperature: 0.7
Top P: 0.9
```

**Use Cases:**

1. **Resume Analysis**
   - Input: Resume text (up to 10,000 tokens)
   - Output: Structured JSON with scores and suggestions
   - Latency: ~2-3 seconds

2. **Job Matching**
   - Input: User profile + job description
   - Output: Compatibility score (0-100)
   - Latency: ~1-2 seconds

3. **Career Planning**
   - Input: Current & target roles, skills
   - Output: Detailed roadmap with milestones
   - Latency: ~3-5 seconds

4. **Email Analysis**
   - Input: Email content
   - Output: Interview detection + details
   - Latency: ~1 second

---

### 6. Authentication Layer (Cognito)

**User Pool Configuration:**
```yaml
Sign-in Options: Email
Password Policy:
  - Minimum Length: 8
  - Requires: Uppercase, Lowercase, Numbers, Symbols
MFA: Optional (TOTP)
Account Recovery: Email verification
User Attributes:
  - email (required, verified)
  - name (required)
```

**Authentication Flow:**
```
1. User signs up → Email verification sent
2. User confirms email → Account activated
3. User signs in → JWT tokens issued
4. Access token used for API calls
5. Refresh token used to get new access token
```

---

## Data Flow

### Job Search Flow

```
┌──────────┐
│  User    │
│ Request  │
└────┬─────┘
     │ 1. GET /api/jobs?userId=123
     ▼
┌──────────────┐
│ API Gateway  │ 2. Validate JWT token
└────┬─────────┘
     │ 3. Invoke Lambda
     ▼
┌──────────────┐
│   Lambda     │ 4. Get user profile from DynamoDB
└────┬─────────┘
     │ 5. Get jobs from DynamoDB
     ▼
┌──────────────┐
│   Bedrock    │ 6. Calculate AI scores for each job
└────┬─────────┘
     │ 7. Sort by score
     ▼
┌──────────────┐
│   Lambda     │ 8. Format response
└────┬─────────┘
     │ 9. Return jobs with scores
     ▼
┌──────────────┐
│   Frontend   │ 10. Display job list
└──────────────┘
```

### Resume Analysis Flow

```
┌──────────┐
│  User    │ 1. Upload resume file
└────┬─────┘
     ▼
┌──────────────┐
│  Frontend    │ 2. Convert to base64
└────┬─────────┘
     │ 3. POST /api/resume/analyze
     ▼
┌──────────────┐
│ API Gateway  │ 4. Validate request
└────┬─────────┘
     │ 5. Invoke Lambda
     ▼
┌──────────────┐
│   Lambda     │ 6. Extract text from PDF/DOCX
└────┬─────────┘
     │ 7. Upload original to S3
     ▼
┌──────────────┐
│     S3       │ 8. Store resume
└──────────────┘
     │
     ▼
┌──────────────┐
│   Bedrock    │ 9. Analyze resume text
└────┬─────────┘
     │ 10. Return analysis
     ▼
┌──────────────┐
│   Lambda     │ 11. Save analysis to DynamoDB
└────┬─────────┘
     │ 12. Return to frontend
     ▼
┌──────────────┐
│  Frontend    │ 13. Display analysis
└──────────────┘
```

---

## Security Architecture

### Network Security

```
Internet → CloudFront → API Gateway → Lambda
                ↓
              WAF (optional)
```

**Security Layers:**
1. **TLS 1.2+** for all communications
2. **API Gateway** with request throttling
3. **Lambda** in VPC (optional, for private resources)
4. **Security Groups** for resource access control

### Authentication & Authorization

```
User → Cognito → JWT Token → API Gateway Authorizer → Lambda
```

**Token Structure:**
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "cognito:groups": ["users"],
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Data Security

**At Rest:**
- DynamoDB: Encrypted with AWS KMS
- S3: AES-256 encryption (SSE-S3)
- Secrets: AWS Secrets Manager

**In Transit:**
- HTTPS/TLS for all API calls
- Signed URLs for S3 access
- VPC endpoints for AWS service communication

### IAM Roles & Policies

**Lambda Execution Role:**
```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel"],
      "Resource": "arn:aws:bedrock:*:*:foundation-model/*"
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:Query", "dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:*:*:table/CareerAgent*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::career-agent-*/*"
    }
  ]
}
```

---

## Scalability & Performance

### Auto-Scaling

**Lambda:**
- Concurrent executions: Up to 1000 (default)
- Auto-scales based on requests
- Reserved concurrency for critical functions

**DynamoDB:**
- On-demand capacity mode
- Auto-scales read/write throughput
- Global tables for multi-region (optional)

**API Gateway:**
- Default limit: 10,000 req/second
- Burst capacity: 5,000 requests
- Configurable throttling per stage

### Performance Optimization

**Caching:**
```
API Gateway → Cache (300s TTL) → Lambda
                ↓
         (Cache Hit: Return immediately)
```

**Lambda Optimization:**
- Warm-up via CloudWatch Events
- Connection pooling for DynamoDB
- Async operations where possible

**Frontend Optimization:**
- Code splitting with Vite
- Lazy loading for routes
- CDN for static assets (CloudFront)

### Cost Optimization

**Estimated Monthly Costs (1000 users):**
```
Lambda:         $50  (500K invocations)
DynamoDB:       $25  (On-demand)
S3:            $10  (100GB storage)
Bedrock:       $100 (50K AI requests)
API Gateway:    $35  (1M requests)
Cognito:       Free (< 50K MAU)
-----------------------------------
Total:         ~$220/month
```

---

## Disaster Recovery

### Backup Strategy

**DynamoDB:**
- Point-in-time recovery enabled
- On-demand backups before major changes
- 35-day retention

**S3:**
- Versioning enabled
- Cross-region replication (optional)
- 90-day retention for deleted versions

### Recovery Procedures

**RTO (Recovery Time Objective):** 1 hour  
**RPO (Recovery Point Objective):** 15 minutes

**Recovery Steps:**
1. Restore DynamoDB tables from backup
2. Restore S3 objects from versions
3. Redeploy Lambda from source control
4. Update API Gateway configuration
5. Verify all integrations

### Monitoring & Alerts

**CloudWatch Metrics:**
- Lambda errors, duration, throttles
- API Gateway 4xx/5xx errors
- DynamoDB consumed capacity
- Bedrock API errors

**Alarms:**
- Lambda error rate > 5%
- API latency > 3 seconds
- DynamoDB throttling events
- Failed Bedrock requests

---

## Future Enhancements

**Planned Features:**
1. Multi-region deployment
2. GraphQL API (AppSync)
3. Real-time features (WebSocket)
4. Machine learning model training
5. Advanced analytics dashboard

---

**Architecture Version:** 1.0  
**Last Updated:** October 2025  
**Maintained By:** Platform Team
