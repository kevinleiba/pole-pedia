const { exec } = require('child_process');
const { pgDump, dumpDbToS3 } = require('./dump_db');
var CronJob = require('cron').CronJob;

new CronJob(
  '0 * * * *',
  function () {
    pgDump().then(dumpDbToS3).catch((code) => {
      console.log(`could not pg_dump. Process exited with code: ${code}`)
    })
  },
  null,
  true,
  'America/Los_Angeles'
);