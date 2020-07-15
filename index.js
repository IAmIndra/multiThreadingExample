const { Worker } = require('worker_threads');
const os = require('os');
const path = require('path');
const numCPUs = os.cpus().length - 2;


testLaborers().then(() => console.log('done')).catch(e => {
  console.log('tremendous error');
  console.log(e);
});
async function testLaborers () {
  console.log('building workers');
  const workers = [];
  for (let i = 0; i < numCPUs; i++) {
    let worker = new Worker(path.join(__dirname, 'worker.js'));
    workers.push(worker);
  }

  await delay(2000);
  let jobs = [
    {num: 0, aggr: 'Datacap', dataSource: 'api'},
    {num: 1, aggr: 'NMI', dataSource: 'api'},
    {num: 2, aggr: 'Authnet', dataSource: 'api'},
    {num: 3, aggr: 'Goldstar', dataSource: 'api'},
    {num: 4, aggr: 'NMI', dataSource: 'api'},
    {num: 5, aggr: 'Authnet', dataSource: 'api'},
    {num: 6, aggr: 'Goldstar', dataSource: 'api'},
    {num: 7, aggr: 'NMI', dataSource: 'api'},
    {num: 8, aggr: 'Authnet', dataSource: 'api'},
    {num: 9, aggr: 'Goldstar', dataSource: 'api'},
    {num: 10, aggr: 'NMI', dataSource: 'api'},
    {num: 11, aggr: 'Authnet', dataSource: 'api'},
    {num: 12, aggr: 'Goldstar', dataSource: 'api'}
  ];
  console.log('starting jobs, # jobs: ', jobs.length);
  console.log('num of cpus: ', numCPUs);
  await runJobs({workers, jobs});
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runJobs ({ workers, jobs }) {
    /** Do your work here **/
    let numJobsDone = 0;
    let results = [];
    let numJobsStarted = 0;
    while (numJobsDone <= jobs.length) {
      let promises = [];
      for ( let i = 0; i < workers.length; i++) {
        let worker = workers[i];
        if (!jobs[numJobsStarted]) continue;
        let job = jobs[numJobsStarted];
        numJobsStarted++;
        promises.push(new Promise((resolve, reject) => {
          worker
            .on('message', msg => {
              console.log(msg, i, msg.num);
              numJobsDone++;
              resolve(msg);
            })
            .on('error', error => {
              console.log(error);
              numJobsDone++;
              reject(error);
            })
            .on('exit', code => {
              if (code !== 1) {
                reject(`Got a funky exit code: ${code}`);
              }
            });

          worker.postMessage(job);
        }));
      }
      await Promise.allSettled(promises).then(results => {
        console.log(`Received ${results.length} results back`);
      });

      console.log('numDone: ', numJobsDone);
      console.log('numStarted: ', numJobsStarted);
      console.log();
    }
}
