import { s3, bucketName, testS3Connection } from '../config/aws';
import { config } from '../config/environment';

async function testS3() {
  console.log('\n🔍 Testing AWS S3 Configuration...\n');
  
  // Display config (without exposing full secret key)
  console.log('Configuration:');
  console.log('- Access Key ID:', config.aws.accessKeyId?.substring(0, 8) + '...');
  console.log('- Region:', config.aws.region);
  console.log('- Bucket Name:', bucketName);
  console.log('');
  
  // Test 1: Connection
  console.log('Test 1: Testing bucket access...');
  const connected = await testS3Connection();
  if (!connected) {
    console.error('❌ Failed to connect to S3 bucket');
    process.exit(1);
  }
  
  // Test 2: Upload
  console.log('\nTest 2: Testing file upload...');
  try {
    const testKey = `test-uploads/test-${Date.now()}.txt`;
    const testContent = 'Hello from DKHOUL! This is a test upload.';
    
    const uploadResult = await s3.upload({
      Bucket: bucketName!,
      Key: testKey,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain'
    }).promise();
    
    console.log('✅ File uploaded successfully!');
    console.log('- Location:', uploadResult.Location);
    console.log('- Key:', uploadResult.Key);
    
    // Test 3: Delete
    console.log('\nTest 3: Testing file deletion...');
    await s3.deleteObject({
      Bucket: bucketName!,
      Key: testKey
    }).promise();
    
    console.log('✅ File deleted successfully!');
    
    // Test 4: List buckets (optional)
    console.log('\nTest 4: Listing accessible buckets...');
    const bucketsResult = await s3.listBuckets().promise();
    console.log('✅ Accessible buckets:', bucketsResult.Buckets?.map((b: any) => b.Name).join(', '));
    
  } catch (error: any) {
    console.error('❌ Upload/Delete test failed:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
      
      // Provide helpful error messages
      if (error.code === 'InvalidAccessKeyId') {
        console.error('\n💡 Tip: Your Access Key ID is invalid or incorrect');
      } else if (error.code === 'SignatureDoesNotMatch') {
        console.error('\n💡 Tip: Your Secret Access Key is incorrect');
      } else if (error.code === 'AccessDenied') {
        console.error('\n💡 Tip: Your IAM user doesn\'t have permission for this operation');
      } else if (error.code === 'NoSuchBucket') {
        console.error('\n💡 Tip: The bucket doesn\'t exist or the name is wrong');
      }
    }
    process.exit(1);
  }
  
  console.log('\n✅ All S3 tests passed! Your configuration is working correctly.\n');
}

testS3().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
