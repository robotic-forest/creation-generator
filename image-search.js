const request = require('request-promise-native')
const path = require('path')
const fs = require('fs');
const { parse } = require('node-html-parser')
var URL = require('url')
const open = require('open')
var sizeOf = require('image-size')
const fsExtra = require('fs-extra')

const imageSearch = searchTerms => {

  const imgurl = `https://www.google.com/search?q=${searchTerms.join('+')}` +
    `&tbm=isch&ved=2ahUKEwj9hZiGman5AhVFkWoFHXGVABQQ2-cCegQIABAA&oq=` +
    searchTerms.join('+') +
    '&gs_lcp=CgNpbWcQAzIECCMQJ1C8C1jWPmDjQmgBcAB4AIABqQeIAbMKkgEFNi42LTGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=36PpYr2aMsWiqtsP8aqCoAE&bih=1087&biw=1905&hl=en'
  console.log(imgurl)

  const imgsearch = await request.get({ uri: imgurl || 'https://www.google.com/search?q=Animals%3B+archaeological%3B+civilization%3B+Mesopotamia%3B++prehistoric%3B+symbiotic&tbm=isch&ved=2ahUKEwjS3sqy56j5AhU-gmoFHXuwAZMQ2-cCegQIABAA&oq=Animals%3B+archaeological%3B+civilization%3B+Mesopotamia%3B++prehistoric%3B+symbiotic&gs_lcp=CgNpbWcQA1DeDVjeDWCHF2gAcAB4AIABQogBQpIBATGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=z2_pYpK7Cb6EqtsP--CGmAk&bih=1102&biw=1920' })
  // console.log(imgsearch)

  const root = parse(imgsearch)
  const links = Array.from(new Set(root.querySelectorAll('a')
    .map(l => l.attributes.href)
    .filter(l => l.slice(0, 5) === '/url?' && !l.includes('google.com/'))
    .map(l => l.slice(7).split('&sa=')[0])))

  fsExtra.emptyDirSync(path.join(__dirname, `tmp/gsearchimages`))

  console.log(links)

  const index = 7
  // for (const link of links.slice(index, index + 1)) {
  for (const link of links) {
    try {
      const html = await request.get({ uri: link })
      const dom = parse(html)

      const imgs = Array.from(new Set(
        dom.querySelectorAll('img')
          .map(img => img.attributes.src)
          .filter(img => !!img)
          .map(img => img.slice(0, 4) !== 'http' ? `https://${URL.parse(link).hostname}${img}` : img)
      ))

      for (const img of imgs) {
        const imgBuffer = await request.get({ uri: img, encoding: null })
        const afterLastSlashRaw = img.substring(img.lastIndexOf('/') + 1)
        const afterLastSlash = afterLastSlashRaw.includes('?')
          ? afterLastSlashRaw.split('?')[0]
          : afterLastSlashRaw

        const tmpImgPath = path.join(__dirname, `tmp/gsearchimages/${afterLastSlash}`)
        fs.writeFileSync(tmpImgPath, imgBuffer)

        sizeOf(tmpImgPath, function (err, dimensions) {
          const minWidth = 300
          const minHeight = 300

          if (dimensions?.width < minWidth || dimensions?.height < minHeight) {
            fsExtra.remove(tmpImgPath)
          } else {
            console.log(`Saved ${afterLastSlash}`)
          }
        })
      }
    } catch (e) {
      // console.log(e)
    }
  }
}

module.exports = {
  imageSearch
}