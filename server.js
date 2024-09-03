const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const httpPort = 3000; 

app.use(bodyParser.json());

// Start the server
app.listen(httpPort, () => {
    console.log(`Server is running on http://localhost:${httpPort}`);
});

const awsIot = require('aws-iot-device-sdk');

// Replace the following placeholders with your values
const device = awsIot.device({
   keyPath: "credentials/81e5e6a3a666ef15c189137f854e262068c25f1af24258a82c73a56e15ce7800-private.pem.key",
  certPath: 'credentials/81e5e6a3a666ef15c189137f854e262068c25f1af24258a82c73a56e15ce7800-certificate.pem.crt',
    caPath: 'credentials/AmazonRootCA1.pem',
  clientId: 'Spare',
      host: 'a27g25yfuax5ui-ats.iot.us-east-1.amazonaws.com'
});

device.on('connect', function() {
  console.log('Connected to AWS IoT Core');
});

device.on('esp32/pzem', function(topic, payload) {
  console.log('message', topic, payload.toString());
});

app.post('/publish/:id', (req, res) => {
    const message = req.body;
  
    device.publish('esp32/led/', JSON.stringify(message), (err) => {
      if (err) {
        console.error('Error publishing message:', err);
        res.status(500).send('Error publishing message');
      } else {
        console.log('Message published successfully');
        res.sendStatus(200);
      }
    });
  });
  
