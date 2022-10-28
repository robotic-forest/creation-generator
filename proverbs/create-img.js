// imprt jimp
const Jimp = require('jimp')
const webshot = require('node-webshot')
const fs = require('fs')

const createImgJimp = async () => {
  const width = 1920
  const height = 1080


  const img = new Jimp(width, height, '#D8C695') // transparent
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
  await img
    .print(font, 0, height / 2, {
      text: 'Hello World',
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_CENTER
    }, width, height)
    .write('files/img.png')
}

// promisify webshot
const generateHTML = (html, path, options) => new Promise((resolve, reject) => {
  const o = {
    screenSize: {
      width: options.width,
      height: options.height
    },
    shotSize: {
      width: options.width,
      height: options.height
    },
    siteType:'html'
  }
  webshot(html, path, o, err => err ? reject(err) : resolve())
})

const createImgWebshot = async () => {
  // parse proverbs.txt and read it linebyline
  const proverbs = fs.readFileSync('./files/proverbs.txt', 'utf8').split('\n')

  // pick a random number between 0 and proverbs.length
  const random = () => Math.floor(Math.random() * proverbs.length)

  const backgroundColor = 'none' // '#D8C695'
  const textColor = 'black'
  const height= 1080
  const width = 1920
  const text = proverbs[random()]
  const fontSize = 64
  const font = 'Verdana, monospace' // 'Arial, sans-serif'
  const weight = 'normal'

  const body = css({
    backgroundColor,
    color: textColor,
    width: '100%',
    textAlign: 'center',
    height: `${height}px`,
    margin: '0px'
  })


  const textStyles = css({
    display: 'inline-block',
    textAlign: 'center',
    width: '80%',
    marginTop: `${(height / 2) - (((text.length / 44) * fontSize) / 2)}px`,
    fontWeight: weight,
    fontFamily: font,
    fontSize: `${fontSize}px`,
    lineHeight: `${fontSize}px`
  })
  

  const html = `
    <!DOCTYPE html>
      <body style="${body}">
        <div style="${textStyles}">
          ${text}
        </div>
      </body>
    </html>
  `

  fs.writeFileSync('files/html.html', html)

  await generateHTML(html, 'files/hello_world.png', { width, height })
}

const createImgWebshotBox = async () => {
  // parse proverbs.txt and read it linebyline
  const proverbs = fs.readFileSync('./files/proverbs.txt', 'utf8').split('\n')

  // pick a random number between 0 and proverbs.length
  const random = () => Math.floor(Math.random() * proverbs.length)

  const backgroundColor = '#D8C695'
  const textColor = 'black'
  const height= 1080
  const width = 1920
  const text = proverbs[random()]
  const fontSize = 64
  const font = 'Verdana, monospace' // 'Arial, sans-serif'
  const weight = 'normal'
  const padding = 80

  const body = css({
    backgroundColor: 'transparent',
    color: textColor,
    width: '100%',
    textAlign: 'center',
    height: `${height}px`,
    margin: '0px'
  })


  const textStyles = css({
    backgroundColor,
    display: 'inline-block',
    textAlign: 'start',
    width: '80%',
    marginTop: `${(height / 2) - (((text.length / 44) * fontSize) / 2) - padding}px`,
    fontWeight: weight,
    fontFamily: font,
    fontSize: `${fontSize}px`,
    lineHeight: `${fontSize}px`,
    // border: '2px solid black',
    padding: `${padding}px`,
    borderRadius: '25px',
    // boxShadow: '0 25px 100px -5px #00000066'
  })
  

  const html = `
    <!DOCTYPE html>
      <body style="${body}">
        <div style="${textStyles}">
          ${text}
        </div>
      </body>
    </html>
  `

  fs.writeFileSync('files/html.html', html)

  await generateHTML(html, 'files/hello_world.png', { width, height })
}

const css = obj => {
  return Object.entries(obj).map(([k, v]) => {
    k = k.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
    return `${k}:${v}`
  }).join(';')
}

// serve images to debug
// light-server -s . -p 7000 -w "create-img.js # node create-img.js"

createImgWebshotBox()
// createImgJimp()