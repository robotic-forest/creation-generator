const { exec } = require("child_process")
const fs = require('fs')

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

const createVideo = async () => {
  const contents = `test
test
test
  `
  fs.writeFile('./tmp/demuxer.txt', contents, err => {
    if (err) return console.log(err);
    console.log('wrote file')
  })
  // execBash('ffmpeg -f concat -i ./tmp/input.txt -vsync vfr -pix_fmt yuv420p output.mp4')
}

module.exports = {
  createVideo
}