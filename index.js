const app = require('express')()
const bodyParser = require('body-parser')

const request = require('request')

app.use(bodyParser.json())

app.get('/webhooks/answer', (req, res) => {
  const ncco = [{
      action: 'talk',
      voiceName: 'Chipmunk',
      bargeIn: true,
      text: '<speak>Hello. Please enter a number between 0 and <prosody rate="fast">99999999999999999999</prosody> followed by the # key.</speak>'
    },
    {
      action: 'input',
      maxDigits: 20,
      timeOut: 10,
      submitOnHash: true,
      eventUrl: [`${req.protocol}://${req.get('host')}/webhooks/dtmf`]
    }
  ]

  res.json(ncco)
})

app.post('/webhooks/events', (req, res) => {
  console.log(req.body)
  res.send(200);
})

app.post('/webhooks/dtmf', (req, res) => {
  let number = req.body.dtmf || 42;
  let message = "";

  request(`http://numbersapi.com/${number}`, (error, response, body) => {
    if (error) {
      message = "The Numbers API has thrown an error."
    } else {
      message = body
    }

    const ncco = [{
        action: 'talk',
        bargeIn: true,
        voiceName: 'Chipmunk',
        text: `<speak><s>${message}</s> <s>Enter another number if you want to continue or just hang up the call if you've had enough.</s></speak>`
      },
      {
        action: 'input',
        maxDigits: 20,
        timeOut: 10,
        submitOnHash: true,
        eventUrl: [`${req.protocol}://${req.get('host')}/webhooks/dtmf`]
      }
    ]

    res.json(ncco)
  })
})

app.listen(3000)
