const axios = require('axios')
const {
  getRandomSentenceStartMiddleEnd,
  firstAndRandomParagraph,
  firstSentencesAll
} = require('./wiki-parsers')

const invocation = async () => {
  const result = await axios.get('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&titles=Tl%C4%81loc')

  if (result.data.query) {
    const rawParagraphs = Object.values(result.data.query.pages)[0].extract
      .split('\n').filter(p => !!p)

    firstSentencesAll({ rawParagraphs })

  } else {
    console.log(result)
    console.log('There was an inglorious error!')
  }
}

invocation()