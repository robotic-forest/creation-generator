var gtts = require('node-gtts')('en')
var path = require('path')

// TODO: use the official API, use a beter voice
// https://cloud.google.com/text-to-speech/docs/voices

const toSpeech = ({ sentences }) => {
  
  for (const [index, sentence] of sentences.entries()) {
    const filepath = path.join(__dirname, `audio/audio${index}.wav`)
    console.log(filepath)

    gtts.save(filepath, sentence, () => {
      console.log(`created audio${index}.wav`)
    })
  }
}

module.exports = {
  toSpeech
}