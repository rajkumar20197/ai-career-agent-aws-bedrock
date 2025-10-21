// AWS Configuration for AI Career Agent Platform
// Ensures proper AWS Bedrock integration for hackathon compliance

export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
  bedrock: {
    modelId: import.meta.env.VITE_BEDROCK_MODEL_ID || 'anthropic.claude-3-5-haiku-20241022-v1:0',
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '',
  },
  cognito: {
    userPoolId: import.meta.env.VITE_USER_POOL_ID || '',
    clientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || '',
  }
};

// Validate AWS configuration
export const validateAWSConfig = (): boolean => {
  const required = [
    awsConfig.region,
    awsConfig.credentials.accessKeyId,
    awsConfig.credentials.secretAccessKey,
    awsConfig.bedrock.modelId
  ];

  const isValid = required.every(value => value && value.length > 0);
  
  if (!isValid) {
    console.warn('AWS configuration incomplete. Please check your .env file.');
    console.warn('Required: VITE_AWS_REGION, VITE_AWS_ACCESS_KEY_ID, VITE_AWS_SECRET_ACCESS_KEY');
  }

  return isValid;
};

// Check if running in development mode with mock data
export const isDevelopmentMode = (): boolean => {
  return import.meta.env.VITE_ENVIRONMENT === 'development' || !validateAWSConfig();
};