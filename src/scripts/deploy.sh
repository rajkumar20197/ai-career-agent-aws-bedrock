#!/bin/bash

###############################################################################
# AI Career Agent Platform - Deployment Script
# Deploys complete serverless infrastructure to AWS
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-dev}
AWS_REGION=${2:-us-east-1}
STACK_NAME="${ENVIRONMENT}-career-agent-stack"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AI Career Agent Platform Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Region: ${YELLOW}${AWS_REGION}${NC}"
echo -e "Stack Name: ${YELLOW}${STACK_NAME}${NC}"
echo ""

# Check AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Check if authenticated
echo -e "${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with AWS${NC}"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓ Authenticated as AWS Account: ${ACCOUNT_ID}${NC}"
echo ""

# Build Lambda deployment package
echo -e "${YELLOW}Building Lambda deployment package...${NC}"
cd backend/lambda

# Create deployment package
if [ -d "package" ]; then
    rm -rf package
fi
mkdir package

# Install dependencies
pip install -r requirements.txt -t package/

# Copy Lambda code
cp index.py package/
cp bedrock_integration.py package/

# Create ZIP file
cd package
zip -r ../lambda-deployment.zip .
cd ..

# Add code files to ZIP
zip -g lambda-deployment.zip index.py bedrock_integration.py

echo -e "${GREEN}✓ Lambda package created${NC}"
cd ../..

# Upload Lambda code to S3 (create bucket if needed)
LAMBDA_BUCKET="${ENVIRONMENT}-career-agent-lambda-${ACCOUNT_ID}"
echo -e "${YELLOW}Uploading Lambda code to S3...${NC}"

if ! aws s3 ls "s3://${LAMBDA_BUCKET}" 2>&1 > /dev/null; then
    echo -e "${YELLOW}Creating S3 bucket: ${LAMBDA_BUCKET}${NC}"
    aws s3 mb "s3://${LAMBDA_BUCKET}" --region ${AWS_REGION}
fi

aws s3 cp backend/lambda/lambda-deployment.zip "s3://${LAMBDA_BUCKET}/lambda-deployment.zip"
echo -e "${GREEN}✓ Lambda code uploaded${NC}"
echo ""

# Deploy CloudFormation stack
echo -e "${YELLOW}Deploying CloudFormation stack...${NC}"
echo -e "${YELLOW}This may take 5-10 minutes...${NC}"

aws cloudformation deploy \
    --template-file infrastructure/cloudformation-template.yaml \
    --stack-name ${STACK_NAME} \
    --parameter-overrides Environment=${ENVIRONMENT} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${AWS_REGION} \
    --no-fail-on-empty-changeset

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ CloudFormation stack deployed successfully${NC}"
else
    echo -e "${RED}✗ CloudFormation deployment failed${NC}"
    exit 1
fi

echo ""

# Update Lambda function code
echo -e "${YELLOW}Updating Lambda function code...${NC}"
FUNCTION_NAME="${ENVIRONMENT}-CareerAgentAPI"

aws lambda update-function-code \
    --function-name ${FUNCTION_NAME} \
    --s3-bucket ${LAMBDA_BUCKET} \
    --s3-key lambda-deployment.zip \
    --region ${AWS_REGION} > /dev/null

echo -e "${GREEN}✓ Lambda function updated${NC}"
echo ""

# Get stack outputs
echo -e "${YELLOW}Retrieving stack outputs...${NC}"

API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${AWS_REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' \
    --output text)

USER_POOL_ID=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${AWS_REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
    --output text)

USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${AWS_REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
    --output text)

# Save configuration
echo -e "${YELLOW}Saving configuration...${NC}"

cat > config/.env.${ENVIRONMENT} << EOF
# AI Career Agent Platform - ${ENVIRONMENT} Environment
# Generated on $(date)

ENVIRONMENT=${ENVIRONMENT}
AWS_REGION=${AWS_REGION}
API_ENDPOINT=${API_ENDPOINT}
USER_POOL_ID=${USER_POOL_ID}
USER_POOL_CLIENT_ID=${USER_POOL_CLIENT_ID}
EOF

echo -e "${GREEN}✓ Configuration saved to config/.env.${ENVIRONMENT}${NC}"
echo ""

# Display deployment information
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}API Endpoint:${NC} ${API_ENDPOINT}"
echo -e "${GREEN}User Pool ID:${NC} ${USER_POOL_ID}"
echo -e "${GREEN}User Pool Client ID:${NC} ${USER_POOL_CLIENT_ID}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your frontend .env file with these values"
echo "2. Test the API endpoints"
echo "3. Create test users in Cognito"
echo ""
echo -e "${GREEN}Deployment logs saved to: deployment-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S).log${NC}"
