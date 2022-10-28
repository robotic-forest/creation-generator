const { default: axios } = require("axios")
const cheerio = require('cheerio')
const fs = require('fs')
const { bash } = require('../utils')

const parsleying = async () => {
  // download a webpage with axios
  const { data } = await axios.get('https://etcsl.orinst.ox.ac.uk/cgi-bin/etcsl.cgi?text=t.6.2.3#')

  // console.log(data)

  // parse the html with cheerio
  const $ = cheerio.load(data)

  const proverbs = []
  $('p').each((i, el) => {
    // throw away everyhing within a span tag
    $(el).find('span').remove()
    $(el).find('a').remove()
    const text = $(el).text()

    const ptext = text.replace(/\(/g, '').replace(/\)/g, '').trim()

    ptext && proverbs.push(ptext)
  })


  // console.log(proverbs)
  // write the proverbs to a file line by line synchronously

  fs.writeFileSync('./files/proverbs.txt', proverbs.join('\n'), err => {
    if (err) return console.log(err);
    console.log('wrote file')
  })

  const result = await bash("cat files/proverbs.txt")
  console.log(result)
}

parsleying()