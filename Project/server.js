const fs = require('fs');
const express = require('express');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

// Starting our app.
const app = express();

// Starting our server.
app.listen(3000, () => {
    console.log('Listening..');
});

app.get('/upload', function(req, res){
    const visualRecognition = new VisualRecognitionV3({
        version: '2018-03-19',
        authenticator: new IamAuthenticator({
          apikey: 'NJI6LS5Mc5GFMxRigm71P1ciRG2sE3196iW96Cz1_2zP',
        }),
        url: 'https://gateway.watsonplatform.net/visual-recognition/api',
      });
      
      
      const classifyParams = {
          imagesFile: fs.createReadStream('./Y246.JPG'),
          owners: ['me'],
          threshold: 0.6,
      };
      
      visualRecognition.classify(classifyParams)
      .then(response => {
          const classifiedImages = response.result;
          let classes = classifiedImages.images[0].classifiers[0].classes
          console.log(classes);
          //console.log(JSON.stringify(classifiedImages, null, 2));
      })
      .catch(err => {
          console.log('error:', err);
      });
})


