const { exec } = require("child_process")

const bash = cmd => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(error)
      if (stderr) resolve(stderr)
      else resolve(stdout)
    })
  })
}

module.exports = {
  bash
}