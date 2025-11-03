import AWS from 'aws-sdk';
import { config } from './environment';

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

export const s3 = new AWS.S3();
export const bucketName = config.aws.bucketName;

// Test S3 connection
export const testS3Connection = async (): Promise<boolean> => {
  try {
    await s3.headBucket({ Bucket: bucketName! }).promise();
    console.log('✅ AWS S3 connected successfully');
    return true;
  } catch (error) {
    console.error('❌ AWS S3 connection error:', error);
    return false;
  }
};

