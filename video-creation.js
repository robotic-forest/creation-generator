const { exec } = require("child_process")
const fs = require('fs')
const path = require('path')
const fsExtra = require('fs-extra')

const execBash = cmd => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  })
}

// https://trac.ffmpeg.org/wiki/Slideshow

const createVideo = async () => {
  const dir = fs.readdir('./tmp/gsearchimages', (err, files) => {
    if (err) {console.log(err); return }

    console.log(files)
    const imageDir = path.join(__dirname, '/tmp/gsearchimages')
    const contents = files
      .map(file => `file '${imageDir}/${file}'`)
      .join('\nduration 3\n')

    fs.writeFile('./tmp/demuxer.txt', contents, err => {
      if (err) return console.log(err);
      console.log('wrote file')
    })

    fsExtra.remove(path.join(__dirname, '/render/output.mp4'))
    // crop=trunc(iw/2)*2:trunc(ih/2)*2
    // pad=ceil(iw/2)*2:ceil(ih/2)*2
    execBash('ffmpeg -f concat -safe 0 -i ./tmp/demuxer.txt -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2" -vsync vfr -pix_fmt yuv420p ./render/output.mp4')
  })
}

module.exports = {
  createVideo
}