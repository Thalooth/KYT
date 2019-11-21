const fs = require('fs');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

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
    console.log(JSON.stringify(classifiedImages, null, 2));
})
.catch(err => {
    console.log('error:', err);
});
