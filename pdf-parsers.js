const request = require('request-promise-native')
const pdf = require('pdf-parse')
const path = require('path')
const fs = require('fs');
const { extractPDFImages } = require('./extract-images');

const stickyWords =[
  "the", "we", "2", "their",
  "there", '1', 'an', '3', 'we',
  "by", 'more', 'have', 'with',
  "at", 'which', 'such', 'they', 'all',
  "and", 'times', '25', 'from', 'p',
  "so", 'through', 'some', 'most',
  "if", 'since', 'these', 'one',
  "than", 'ha', 'b', 'hi',
  "but",
  "about",
  "in",
  "on",
  "the",
  "was",
  "for",
  "that",
  "said",
  "a",
  "or",
  "of",
  "to",
  "there",
  "will",
  "be",
  "what",
  "get",
  "go",
  "think",
  "just",
  "every",
  "are",
  "it",
  "were",
  "had",
  "i",
  "very",
  'is', 'm', '4',
  'as', 'vol', 'can',
  'this', 'thi', 'wa', 'al',
  's', ''
]

function findKeyWords(str) {
  let words = str.toLowerCase().match(/\w+/g);

  let occurances = {}

  const singularWords = words.map(w => w[w.length - 1] === 's'
    ? w.slice(0, w.length - 1)
    : w
  )

  for (let word of singularWords) {
    if (occurances[word]) {
      occurances[word]++;
    } else {
      occurances[word] = 1;
    }
  }

  let sortable = [];
  for (var word in occurances) {
      sortable.push([word, occurances[word]])
  }

  const sorted = sortable.sort(function(a, b) {
      return b[1] - a[1];
  })

  return sortable
    .filter(w => !stickyWords.includes(w[0]))
    .map(w => w[0])
}

const downloadPDF = async (pdfURL) => {
  const pdfBuffer = await request.get({ uri: pdfURL, encoding: null })
  return pdfBuffer
}

const pdfParser = async (url, options) => {
  const pdfBuffer = await downloadPDF(url)

  // Save locally
  const tmpPDFPath = path.join(__dirname, `tmp/tmp.pdf`)
  fs.writeFileSync(tmpPDFPath, pdfBuffer)

  if (options?.extractImages) await extractPDFImages(tmpPDFPath)

  const parsedPDF = await pdf(pdfBuffer)

  return {
    text: parsedPDF.text,
    keywords: findKeyWords(parsedPDF.text)
  }

}

module.exports = {
  pdfParser
}