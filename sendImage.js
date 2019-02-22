
const flags = require('flags');
const io = require('socket.io-client')
const qr = require('qr-image');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');


const directory = 'PaymentQRs';

flags.defineInteger('size', 32, 'Size of the img in px');
flags.defineInteger('startingPoint', 499-flags.get('size')/2, 'What point do you want to draw the picture (Middle is default)');
flags.defineString('image', 'PossibleImages/underpants.jpg', 'Path to image');
flags.defineString('socket', 'testnet', 'API endpoint');

flags.parse();

const size = flags.get('size');
var imageURI =  flags.get('image');
var startingPoint = flags.get('startingPoint')
var socket
if (flags.get('socket') == 'testnet'){
  socket = io('https://testnet-api.satoshis.place')
}else if (flags.get('socket') == 'mainnet'){
  socket = io('https://api.satoshis.place')
}else{
  console.log("ERROR: Flag socket can only be testnet or mainnet")
  console.log(flags.get('socket'))
  process.exit(1);
}

console.log("starting drawing point " + startingPoint + ', '+startingPoint)

if (imageURI == undefined){
console.log("ERROR specify the image to send like so: node sendImage.js --size 32 --image PossibleImages/underpants.jpg")
process.exit(1);
}



fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});

// Listen for errors
socket.on('error', ({ message }) => {
  // Requests are rate limited by IP Address at 10 requests per second.
  // You might get an error returned here.
  console.log('Error with socket:')
  console.log(message)
})

var qrIndex = 0;

// Wait for connection to open before setting up event listeners
socket.on('connect', a => {
  console.log('API Socket connection established with id satoshi\'s place, your ID is: ', socket.id)
  // Subscribe to events
  socket.on('GET_LATEST_PIXELS_RESULT', function(msg){
    console.log('LatestPixels: ');
    // console.log(msg);
  });
  socket.on('NEW_ORDER_RESULT', function(msg){
    console.log('Your new order was accepted by Satoshi\'s place: ' );   
    if (msg.data != undefined) {
        var qr_svg = qr.image(msg.data.paymentRequest, { type: 'png' });
        qr_svg.pipe(require('fs').createWriteStream('PaymentQRs/QR'+qrIndex+'.png'));
        qrIndex++
        console.log('New payment image generated open and scan PaymentQRs/QR'+qrIndex+'.png' );    
    } else if (msg.error != undefined){
        process.exit(1);
    }
  });
  socket.on('ORDER_SETTLED', function(msg){
    if(socket.id == msg.data.sessionId){
        console.log('\n\n')
        console.log('Order settled, your beautiful image is ready :)' );
        console.log('PaymentRequest')
        console.log(msg.data.paymentRequest);
        console.log('Pixels painted')
        console.log(msg.data.pixelsPaintedCount);
        process.exit(0);
    }
  });
  socket.on('GET_SETTINGS_RESULT', function(msg){
    console.log('Settings: ');
    console.log(msg);
  });
})


var acceptedColors = {
    color1: '#ffffff',
    color2: '#e4e4e4',
    color3: '#888888',
    color4: '#222222',
    color5: '#e4b4ca',
    color6: '#d4361e',
    color7: '#db993e',
    color8: '#8e705d',
    color9: '#e6d84e',
    color10: '#a3dc67',
    color11: '#4aba38',
    color12: '#7fcbd0',
    color13: '#5880a8',
    color14: '#3919d1',
    color15: '#c27ad0',
    color16: '#742671'
  };

var nearestColor = require('nearest-color').from(acceptedColors);

 
// open a file called "lenna.png"
Jimp.read(imageURI, (err, image) => {
    if (err) throw err;
    image
      .resize(size, size) // resize
      console.log("Generating image...")

      var exampleImage = []
      indexTotal = 0
      for (let index = 0; index < size; index++) {
          for (let index2 = 0; index2 < size; index2++) {
              try{
                var readColor = image.getPixelColor(index, index2);
                color = "#"+ readColor.toString(16).substring(0, 6);
                color = nearestColor(color).value
              }catch (e){
                console.log(e.message)
                console.log("Try other picture or a different size")
                process.exit(1);
              }
              var coordinateObject = {
                  coordinates: [parseInt(startingPoint)+index, parseInt(startingPoint)+index2],
                  color: color
                }
            image.setPixelColor(readColor, index, index2);
            exampleImage[indexTotal] = coordinateObject
            indexTotal++
          }
      }
      console.log("Image generated, sending it")
    //   for (let index = 0; index < size/128; index++) {
    //     var partialImage = imageObject.slice(index*128, index*128+128);
    //     socket.emit('NEW_ORDER', partialImage)
    //     console.log('Order sent')
    //     socket.emit('GET_SETTINGS')
    // }
      socket.emit('NEW_ORDER', exampleImage)
      console.log("Image sent awaiting response")
      image.write("ExpectedImageResult.jpg")

  });



