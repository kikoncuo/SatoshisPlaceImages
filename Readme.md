# Shatoshi's place image bot

[![NPM Version][npm-image]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]

Requirements:
* [Node](https://nodejs.org/) - Node 8 or newer 

Simple bot which takes an image and calculates the necessary payments to satoshis.place, and testnet.satoshis.place.


It prints the payment requests, and generates scaneable QR codes inside of `/PaymentQRs/` It will generate more than one if the image is over 256px because of response times from satoshi's place (TBD).


Also, generates the expected result at `ExpectedImageResult.jpg`

Example:

```node sendImage.js --size 32 --image PossibleImages/underpants.jpg --startingPoint 0 --socket=testnet```

Only --image is required, default values are size 32, startingPoint middle and socket testnet.

## Authors

* **Enrique Alcázar** - [@enriquealcazarg](https://twitter.com/enriquealcazarg)

See also the list of [contributors](https://github.com/kikoncuo/SatoshisPlaceImages/contributors) who participated in this project.

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request