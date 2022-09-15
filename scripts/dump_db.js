const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs')
const { spawn } = require('child_process');

require('dotenv').config({ path: path.join(__dirname, '../.env') })

const DUMP_NAME = 'dump.sql'

function pgDump() {
  return new Promise((resolve, reject) => {
    const DB_URL = process.env.DATABASE_URL
    const DB_NAME = DB_URL.split('/')[3]

    const child = spawn('pg_dump', [DB_NAME, '-a', '-f', DUMP_NAME])

    child.on('exit', function (code, signal) {
      if (code === 0 && signal === null) return resolve()
      reject(code)
    });
  })
}

function dumpDbToS3() {
  AWS.config.update({ region: process.env.AWS_REGION });

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  const fileName = DUMP_NAME
  const fileContent = fs.readFileSync(fileName)

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent
  }

  s3.upload(params, (err, _data) => {
    if (err) {
      console.log(err)
    }
  })
}

pgDump().then(dumpDbToS3).catch((code) => {
  console.log(`could not pg_dump. Process exited with code: ${code}`)
})