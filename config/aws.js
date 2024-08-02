const awsIot = require('aws-iot-device-sdk');
require('dotenv').config();


// Replace the following placeholders with your values
const device = awsIot.device({
   keyPath: process.env.KEY_PATH,
  certPath:process.env.CERT_PATH ,
    caPath: process.env.CA_PATH,
  clientId: process.env.CLIENTID,
      host: process.env.AWS_HOST
});

device.on('connect', function() {
  console.log('Connected to AWS IoT Core');
  // After connecting, you may want to publish/subscribe to topics
  device.subscribe('esp32/sub');
  device.publish('esp32/pub', JSON.stringify({ key: 'value' }));
});


device.on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });

  module.exports = device;