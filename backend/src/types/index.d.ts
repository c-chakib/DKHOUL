// Global type definitions
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      MONGODB_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AWS_BUCKET_NAME: string;
      STRIPE_SECRET_KEY: string;
      SENDGRID_API_KEY: string;
      FROM_EMAIL: string;
      CLIENT_URL: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
    }
  }
}

export {};
