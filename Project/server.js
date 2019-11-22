// call all the required packages
const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const app = express()
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');

app.use(bodyParser.urlencoded({extended: true}))
 


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
  })
   
  var upload = multer({ storage: storage })


//ROUTES WILL GO HERE
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');   
});

app.post('/upload', upload.single('photo'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    console.log(req.file.filename);

    const visualRecognition = new VisualRecognitionV3({
        version: '2018-03-19',
        authenticator: new IamAuthenticator({
          apikey: 'NJI6LS5Mc5GFMxRigm71P1ciRG2sE3196iW96Cz1_2zP',
        }),
        url: 'https://gateway.watsonplatform.net/visual-recognition/api',
      });
      
      
      const classifyParams = {
          imagesFile: fs.createReadStream('uploads/'+req.file.filename),
          owners: ['me'],
          threshold: 0.6,
      };
      
      visualRecognition.classify(classifyParams)
      .then(response => {
          const classifiedImages = response.result;
          let classes = classifiedImages.images[0].classifiers[0].classes
          console.log(classes)
          let op
          if(classes[0].class == "Yes"){
            op = "<h2>Sorry, your result is Positive. Accuracy : " + classes[0].score + "</h2><a href='http://localhost:3000'> Go Back</a>"
          }else{
            op = "<h2>Congrats, your result is Negative. Accuracy : " + classes[0].score + "</h2><a href='http://localhost:3000'> Go Back</a>"
          }
          res.send(op)
          //console.log(JSON.stringify(classifiedImages, null, 2));
      })
      .catch(err => {
          console.log('error:', err);
      });
    
  })
 
app.listen(3000, () => console.log('Server started on port 3000'));