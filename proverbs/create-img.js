// imprt jimp
const Jimp = require('jimp')

const createImg = async () => {
  const width = 1920
  const height = 1080


  const img = new Jimp(width, height, '#D8C695') // transparent
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
  const text = await img
    .print(font, 0, height / 2, {
      text: 'Hello World',
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_CENTER
    }, width, height)
    .write('files/img.png')
}

createImg()