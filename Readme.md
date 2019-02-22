#Shatoshi's place image bot

Simple bot which takes an image and calculates the necessary payments to satoshis.place, and testnet.satoshis.place.


It prints the payment requests, and generates scaneable QR codes inside of `/PaymentQRs/` It will generate more than one if the image is over 256px because of response times from satoshi's place (TBD).


Also, generates the expected result at `ExpectedImageResult.jpg`

Example:

```node sendImage.js --size 32 --image PossibleImages/underpants.jpg --startingPoint 0 --socket=testnet```

Only --image is required, default values are size 32, startingPoint middle and socket testnet.

