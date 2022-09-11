const chalk = require('chalk')
const axios = require('axios')
const { toSpeech } = require('./text-to-speech.js')

const getRandomSentenceStartMiddleEnd = ({ rawParagraphs }) => {
  // Remove everything after See also
  const seeAlsoIndex = rawParagraphs.indexOf(rawParagraphs.find(p => p === '== See also =='))
  const paragraphs = rawParagraphs.slice(0, seeAlsoIndex)

  // console.log({ paragraphs })

  const titles = paragraphs.filter(p => p.slice(0, 2) === '==')
  // console.log({ titles, l: titles.length })

  const buckets = []
  const chunkSize = Math.ceil(titles.length / 3)
  for (let i = 0; i < titles.length; i += chunkSize) {
      const chunk = titles.slice(i, i + chunkSize)
      buckets.push(chunk)
  }

  // console.log({ buckets })
  for (const bucket of buckets) {
    const randomTitle = bucket[Math.floor(Math.random() * bucket.length)]
    const cleanedTitle = randomTitle.replaceAll('=', '').trim()

    let paragraph
    const titleIndex = paragraphs.indexOf(paragraphs.find(p => p === randomTitle))
    if (paragraphs[titleIndex + 1]) {
      paragraph = paragraphs[titleIndex + 1]
    }      
  
    // console.log(cleanedTitle + '\n\n' + paragraph + '\n')

    const sentences = paragraph.split('. ')

    // console.log(sentences)
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)]

    console.log(randomSentence + '\n')
  }
}

const firstAndRandomParagraph = ({ rawParagraphs }) => {
  const seeAlsoIndex = rawParagraphs.indexOf(rawParagraphs.find(p => p === '== See also =='))
  const paragraphs = rawParagraphs.slice(0, seeAlsoIndex)

  const nonTitleParagraphs = paragraphs.filter(p => p.slice(0, 2) !== '==')
  const firstParagraph = nonTitleParagraphs[0]
  const randomParagraph = nonTitleParagraphs[Math.floor(Math.random() * nonTitleParagraphs.length)]

  console.log(firstParagraph + '\n\n' + randomParagraph)
}

const firstSentencesAll = ({ rawParagraphs }) => {
  const seeAlsoIndex = rawParagraphs.indexOf(rawParagraphs.find(p => p === '== See also =='))
  const paragraphs = rawParagraphs.slice(0, seeAlsoIndex)

  const sentences = paragraphs.map(p => {
    if (p.slice(0, 2) === '==') {
      const title = p.replaceAll('=', '').trim()
      // console.log(chalk.green('\n' + title))
    } else {
      const sentence = p.split('. ')[0].trim() + '.'
      // console.log(sentence)
      return sentence
    }
  }).filter(s => !!s)

  const payload = sentences.slice(0, 3)
  
  console.log(payload)
  toSpeech({ sentences: payload })

}

const wikiParser = async () => {
  const url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts' +
  '&exlimit=max&explaintext&titles=Tl%C4%81loc'
  
  const result = await axios.get(url)

  if (result.data.query) {
    const rawParagraphs = Object.values(result.data.query.pages)[0].extract
      .split('\n').filter(p => !!p)

    firstSentencesAll({ rawParagraphs })

  } else {
    console.log(result)
    console.log('There was an inglorious error!')
  }
}

module.exports = {
  getRandomSentenceStartMiddleEnd,
  firstAndRandomParagraph,
  firstSentencesAll,
  wikiParser
}