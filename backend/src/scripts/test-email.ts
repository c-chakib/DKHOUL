import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

const testEmail = async () => {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    const from = process.env.EMAIL_FROM || 'noreply@dkhoul.me';

    if (!apiKey) {
      console.error('❌ SENDGRID_API_KEY is not set in .env file');
      process.exit(1);
    }

    console.log('🔧 Configuring SendGrid...');
    console.log('   API Key:', apiKey.substring(0, 20) + '...');
    console.log('   From Email:', from);

    sgMail.setApiKey(apiKey);

    const msg = {
      to: 'ccheikhi@gmail.com',
      from: from,
      subject: 'Test Email from DKHOUL Platform',
      text: 'This is a test email to verify SendGrid integration.',
      html: '<strong>This is a test email to verify SendGrid integration.</strong><br><br>If you receive this, SendGrid is working correctly! ✅'
    };

    console.log('\n📧 Sending test email...');
    console.log('   To:', msg.to);
    console.log('   From:', msg.from);
    console.log('   Subject:', msg.subject);

    const response = await sgMail.send(msg);

    console.log('\n✅ Email sent successfully!');
    console.log('   Status Code:', response[0].statusCode);
    console.log('   Message ID:', response[0].headers['x-message-id']);
    console.log('\n✨ Check your inbox for the test email!');

  } catch (error: any) {
    console.error('\n❌ Error sending email:');
    if (error.response) {
      console.error('   Status:', error.response.statusCode);
      console.error('   Body:', JSON.stringify(error.response.body, null, 2));
    } else {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  }
};

testEmail();
