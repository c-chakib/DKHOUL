import AWS from 'aws-sdk';
import { config } from './environment';
import fs from 'fs';
import path from 'path';
import os from 'os';

const isTest = config.env === 'test' || process.env.NODE_ENV === 'test';

if (!isTest) {
  AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
  });
}

// When running tests, avoid real AWS calls and use a simple local filesystem-backed mock
const localDir = path.join(os.tmpdir(), 'dkhoul-test-uploads');
const ensureLocalDir = async (key: string) => {
  const fullPath = path.join(localDir, key);
  await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
  return fullPath;
};

const s3Mock = {
  upload: ({ Key, Body }: any) => ({
    promise: async () => {
      const fullPath = await ensureLocalDir(Key);
      await fs.promises.writeFile(fullPath, Body);
      return { Location: `file://${fullPath}`, Key };
    }
  }),
  deleteObject: ({ Key }: any) => ({
    promise: async () => {
      const fullPath = path.join(localDir, Key);
      try {
        await fs.promises.unlink(fullPath);
      } catch (e) {
        // ignore
      }
      return {};
    }
  }),
  headBucket: ({ Bucket }: any) => ({
    promise: async () => {
      // pretend the bucket exists in test
      return true;
    }
  })
};

export const s3 = isTest ? (s3Mock as any) : new AWS.S3();
export const bucketName = config.aws.bucketName || (isTest ? 'local' : undefined);

// Test S3 connection
export const testS3Connection = async (): Promise<boolean> => {
  try {
    // In test mode the mock always succeeds
    if (isTest) return true;
    await s3.headBucket({ Bucket: bucketName! }).promise();
    console.log('✅ AWS S3 connected successfully');
    return true;
  } catch (error) {
    console.error('❌ AWS S3 connection error:', error);
    return false;
  }
};

