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
  clientId: 'client',
  host: 'a27g25yfuax5ui-ats.iot.us-east-1.amazonaws.com'
});

device.on('connect', function() {
  console.log('Connected to AWS IoT Core');

  /*
  
  
    SUBSCRIBE TO THE STATE OF ALL LED 
    THE PAYLOAD WILL BE 
    {
      "state": {
        "desired": {
          "welcome": "aws-iot",
          "relay_1": 1,
          "relay_2": 1,
          "relay_3": 1,
          "relay_4": 1,
          "relay_5": 1,
          "relay_6": 1,
          "relay_7": 1,
          "relay_8": 0
        },
        "reported": {
          "welcome": "aws-iot",
          "relay_1": 1,
          "relay_2": 1,
          "relay_3": 1,
          "relay_4": 1,
          "relay_5": 1,
          "relay_6": 1,
          "relay_7": 1,
          "relay_8": 0
        }
      }
    }

    REPORTED AND DESIRED WILL BE THE SAME IF THE OBJECT IS CONNECTED TO INTERNET
  */
  device.subscribe('$aws/things/Spare/shadow/get/accepted',(err,paylod,hafa)=>{
    if(err)console.log(err)
    console.log(paylod)
    device.emit("message","accepted",JSON.stringify(paylod))
  });

  /*

    THE MEASUREMENT OF PZEM004T SENSOR 
    THE RESPONSE WILL BE 

  

  */

  device.subscribe('esp32/pzem',(err,paylod,hafa)=>{
    if(err)console.log(err)
    console.log(paylod)
    device.emit("message","accepted",JSON.stringify(paylod))
  });

});

device.on('message', function(topic, payload) {
  console.log('message', topic, payload.toString());
});

app.post('/publish', (req, res) => {
    const message = req.body;
  
    device.publish('$aws/things/Spare/shadow/update', JSON.stringify(message), (err) => {
      if (err) {
        console.error('Error publishing message:', err);
        res.status(500).send('Error publishing message');
      } else {
        console.log('Message published successfully');
        res.sendStatus(200);
      }
    });
  });
  
