const { wikiParser } = require('./wiki-parsers')
const { pdfParser } = require('./pdf-parsers')

const invocation = async () => {
  pdfParser()
}

invocation()