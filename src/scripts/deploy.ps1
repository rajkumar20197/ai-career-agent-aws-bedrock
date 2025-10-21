# AI Career Agent Platform - PowerShell Deployment Script
# For Windows environments

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Green
Write-Host "AI Career Agent Platform Deployment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host ""

$StackName = "$Environment-career-agent-stack"

# Check AWS CLI
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "Error: AWS CLI is not installed" -ForegroundColor Red
    exit 1
}

# Check AWS credentials
Write-Host "Checking AWS credentials..." -ForegroundColor Yellow
try {
    $AccountId = aws sts get-caller-identity --query Account --output text
    Write-Host "✓ Authenticated as AWS Account: $AccountId" -ForegroundColor Green
} catch {
    Write-Host "Error: Not authenticated with AWS" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Build Lambda package
Write-Host "Building Lambda deployment package..." -ForegroundColor Yellow
Set-Location backend\lambda

# Clean and create package directory
if (Test-Path package) {
    Remove-Item -Recurse -Force package
}
New-Item -ItemType Directory -Path package | Out-Null

# Install dependencies
pip install -r requirements.txt -t package\

# Copy Lambda code
Copy-Item index.py package\
Copy-Item bedrock_integration.py package\

# Create ZIP file
Compress-Archive -Path package\* -DestinationPath lambda-deployment.zip -Force

Write-Host "✓ Lambda package created" -ForegroundColor Green
Set-Location ..\..

# Upload to S3
$LambdaBucket = "$Environment-career-agent-lambda-$AccountId"
Write-Host "Uploading Lambda code to S3..." -ForegroundColor Yellow

try {
    aws s3 ls "s3://$LambdaBucket" 2>&1 | Out-Null
} catch {
    Write-Host "Creating S3 bucket: $LambdaBucket" -ForegroundColor Yellow
    aws s3 mb "s3://$LambdaBucket" --region $Region
}

aws s3 cp backend\lambda\lambda-deployment.zip "s3://$LambdaBucket/lambda-deployment.zip"
Write-Host "✓ Lambda code uploaded" -ForegroundColor Green
Write-Host ""

# Deploy CloudFormation
Write-Host "Deploying CloudFormation stack..." -ForegroundColor Yellow
Write-Host "This may take 5-10 minutes..." -ForegroundColor Yellow

aws cloudformation deploy `
    --template-file infrastructure\cloudformation-template.yaml `
    --stack-name $StackName `
    --parameter-overrides Environment=$Environment `
    --capabilities CAPABILITY_NAMED_IAM `
    --region $Region `
    --no-fail-on-empty-changeset

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ CloudFormation stack deployed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ CloudFormation deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Update Lambda code
Write-Host "Updating Lambda function code..." -ForegroundColor Yellow
$FunctionName = "$Environment-CareerAgentAPI"

aws lambda update-function-code `
    --function-name $FunctionName `
    --s3-bucket $LambdaBucket `
    --s3-key lambda-deployment.zip `
    --region $Region | Out-Null

Write-Host "✓ Lambda function updated" -ForegroundColor Green
Write-Host ""

# Get outputs
Write-Host "Retrieving stack outputs..." -ForegroundColor Yellow

$ApiEndpoint = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' `
    --output text

$UserPoolId = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' `
    --output text

$UserPoolClientId = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' `
    --output text

# Save configuration
Write-Host "Saving configuration..." -ForegroundColor Yellow

if (-not (Test-Path config)) {
    New-Item -ItemType Directory -Path config | Out-Null
}

@"
# AI Career Agent Platform - $Environment Environment
# Generated on $(Get-Date)

ENVIRONMENT=$Environment
AWS_REGION=$Region
API_ENDPOINT=$ApiEndpoint
USER_POOL_ID=$UserPoolId
USER_POOL_CLIENT_ID=$UserPoolClientId
"@ | Out-File -FilePath "config\.env.$Environment"

Write-Host "✓ Configuration saved to config\.env.$Environment" -ForegroundColor Green
Write-Host ""

# Display summary
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "API Endpoint: " -ForegroundColor Green -NoNewline
Write-Host $ApiEndpoint
Write-Host "User Pool ID: " -ForegroundColor Green -NoNewline
Write-Host $UserPoolId
Write-Host "User Pool Client ID: " -ForegroundColor Green -NoNewline
Write-Host $UserPoolClientId
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update your frontend .env file with these values"
Write-Host "2. Test the API endpoints"
Write-Host "3. Create test users in Cognito"
