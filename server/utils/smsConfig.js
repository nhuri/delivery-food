const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

async function sendSMS(to, message) {
  const from = "YourAppName"; // Change this to your desired sender name

  try {
    const response = await vonage.sms.send({ to, from, text: message });
    if (response.messages[0].status === '0') {
      console.log('Message sent successfully');
    } else {
      console.error(`Message failed with error: ${response.messages[0]['error-text']}`);
      throw new Error(response.messages[0]['error-text']);
    }
  } catch (err) {
    console.error('There was an error sending the message.');
    throw new Error(err.message);
  }
}

module.exports = sendSMS;  // Ensure you export the sendSMS function
