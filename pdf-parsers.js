const request = require('request-promise-native')
const pdf = require('pdf-parse')
const PdfExtractor = require('pdf-extractor').PdfExtractor
var path = require('path')

const downloadPDF = async (pdfURL) => {
  const pdfBuffer = await request.get({ uri: pdfURL, encoding: null })
  return pdfBuffer
}

function toArrayBuffer(buf) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
  }
  return view;
}

let outputDir = path.join(__dirname, `pdf-images`)
pdfExtractor = new PdfExtractor(outputDir, {
    viewportScale: (width, height) => {
        //dynamic zoom based on rendering a page to a fixed page size 
        if (width > height) {
            //landscape: 1100px wide
            return 1100 / width
        }
        //portrait: 800px wide
        return 800 / width
    },
    pageRange: [1,5],
})

const pdfParser = async () => {
  const url = 'https://www.asjp.cerist.dz/en/downArticle/681/5/1/198472'
  const pdfBuffer = await downloadPDF(url)
  console.log({ pdfBuffer })

  // pdf(pdfBuffer).then(data => {
 
  //   // number of pages
  //   console.log(data.numpages)
  //   // number of rendered pages
  //   console.log(data.numrender)G
  //   // PDF info
  //   console.log(data.info)
  //   // PDF metadata
  //   console.log(data.metadata) 
  //   // PDF.js version
  //   // check https://mozilla.github.io/pdf.js/getting_started/
  //   console.log(data.version)
  //   // PDF text
  //   console.log(data.text) 
  // })

  pdfExtractor.parse(toArrayBuffer(pdfBuffer)).then(function () {
    console.log('# End of Document')
  }).catch(function (err) {
    console.error('Error: ' + err)
  })

}

module.exports = {
  pdfParser
}