import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dkhoul'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
    // keep backward-compatible env names but expose properties expected by services/tests
    expiresIn: process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD
  },
  
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    bucketName: process.env.AWS_BUCKET_NAME
  },
  
  email: {
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.EMAIL_FROM || 'noreply@dkhoul.ma',
    fromName: process.env.EMAIL_FROM_NAME || 'DKHOUL'
  },
  
  payment: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    },
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID,
      secret: process.env.PAYPAL_SECRET,
      mode: process.env.PAYPAL_MODE || 'sandbox'
    }
  },
  
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',

  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET
    }
  }
};

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
  // 'JWT_REFRESH_SECRET' - removed since it has a default value
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

export default config;

