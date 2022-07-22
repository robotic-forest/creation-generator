const axios = require('axios')
const { getRandomSentenceStartMiddleEnd } = require('./wiki-parsers')

const invocation = async () => {
  const result = await axios.get('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&titles=Tl%C4%81loc')

  if (result.data.query) {
    // console.log(Object.values(result.data.query.pages)[0])

    const rawParagraphs = Object.values(result.data.query.pages)[0].extract
      .split('\n').filter(p => !!p)
    // console.log({ rawParagraphs })

    // getRandomSentenceStartMiddleEnd({ rawParagraphs })

    const seeAlsoIndex = rawParagraphs.indexOf(rawParagraphs.find(p => p === '== See also =='))
    const paragraphs = rawParagraphs.slice(0, seeAlsoIndex)

    const titles = paragraphs.filter(p => p.slice(0, 2) === '==')
    const randomTitle = titles[Math.floor(Math.random() * titles.length)]

    let paragraph
    const titleIndex = paragraphs.indexOf(paragraphs.find(p => p === randomTitle))
    if (paragraphs[titleIndex + 1]) {
      paragraph = paragraphs[titleIndex + 1]
    }

    const cleanedTitle = randomTitle.replaceAll('=', '').trim()
    const cleanedParagraph = paragraph.trim()

    console.log(cleanedTitle + '\n\n' + cleanedParagraph)

  } else {
    console.log(result)
    console.log('There was an inglorious error!')
  }
}

invocation()