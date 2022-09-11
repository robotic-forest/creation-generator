const request = require('request-promise-native')
const path = require('path')
const fs = require('fs');
const { parse } = require('node-html-parser')
var URL = require('url')
const open = require('open')
var sizeOf = require('image-size')
const fsExtra = require('fs-extra')

const imageSearch = async searchTerms => {
  if (!searchTerms) {
    console.log('Required 1 arg: Array of search terms')
    return
  }

  const imgurl = `https://www.google.com/search?q=${searchTerms.join('+')}` +
    `&tbm=isch&ved=2ahUKEwj9hZiGman5AhVFkWoFHXGVABQQ2-cCegQIABAA&oq=` +
    searchTerms.join('+') +
    '&gs_lcp=CgNpbWcQAzIECCMQJ1C8C1jWPmDjQmgBcAB4AIABqQeIAbMKkgEFNi42LTGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=36PpYr2aMsWiqtsP8aqCoAE&bih=1087&biw=1905&hl=en'

  const imgsearch = await request.get({ uri: imgurl })
  // console.log(imgsearch)

  const root = parse(imgsearch)
  const links = Array.from(new Set(root.querySelectorAll('a')
    .map(l => l.attributes.href)
    .filter(l => l.slice(0, 5) === '/url?' && !l.includes('google.com/'))
    .map(l => l.slice(7).split('&sa=')[0])))

  fsExtra.emptyDirSync(path.join(__dirname, `tmp/gsearchimages`))

  console.log(links)

  let i = 0
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
        const afterLastSlashRaw = img.substring(img.lastIndexOf('.') + 1)
        const afterLastSlash = afterLastSlashRaw.includes('?')
          ? afterLastSlashRaw.split('?')[0]
          : afterLastSlashRaw

        if (afterLastSlash.toLowerCase() === 'svg') continue

        const imgName = `tmp/gsearchimages/img00${i + 1}.${afterLastSlash}`
        const tmpImgPath = path.join(__dirname, imgName)
        fs.writeFileSync(tmpImgPath, imgBuffer)

        sizeOf(tmpImgPath, function (err, dimensions) {
          const minWidth = 300
          const minHeight = 300

          if (dimensions?.width < minWidth || dimensions?.height < minHeight) {
            fsExtra.remove(tmpImgPath)
          } else {
            console.log(`Saved ${imgName}`)
            i++
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