const { wikiParser } = require('./wiki-parsers')
const { pdfParser } = require('./pdf-parsers')

const url2 = 'https://www.asjp.cerist.dz/en/downArticle/681/5/1/198472'
const url = 'https://protocodex-files.s3.amazonaws.com/2c596849-cc15-49eb-bcfc-3664070321ae-Pournelle_Marshland.pdf'

const invocation = async () => {
  const { text } = await pdfParser(url2, { extractImages: false })

  // console.log(text)

  const searchTerms = ['archaeological', 'mesopotamia', 'animals', 'civilization']

}

invocation()