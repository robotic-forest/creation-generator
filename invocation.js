const { wikiParser } = require('./wiki-parsers')
const { pdfParser } = require('./pdf-parsers')
const { imageSearch } = require('./image-search')
const { createVideo } = require('./video-creation')
const fs = require('fs')
const { lexica } = require('./ai-vision/lexica')

const { spawn } = require('child_process')

const url2 = 'https://www.asjp.cerist.dz/en/downArticle/681/5/1/198472'
const url = 'https://protocodex-files.s3.amazonaws.com/2c596849-cc15-49eb-bcfc-3664070321ae-Pournelle_Marshland.pdf'

const invocation = async () => {
  const { text, keywords } = await pdfParser(url2, { extractImages: false })

  // console.log(text)

  fs.writeFile('./tmp/pdf-text.txt', text, err => {
    if (err) return console.log(err);
    console.log('wrote file')
  })

  // console.log(keywords)
  // await imageSearch(keywords)

  // createVideo()

  // spawn new child process to calls the python script
  const python = spawn('python', [`python/huggingface.py`]);
  // collect data from script
  python.stdout.on('data', data => {
    console.log(data.toString())
  })
}

invocation()