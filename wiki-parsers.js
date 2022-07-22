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

module.exports = {
  getRandomSentenceStartMiddleEnd
}