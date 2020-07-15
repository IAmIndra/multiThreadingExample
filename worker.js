require('module-alias/register');
const { WorkerData, parentPort } = require('worker_threads');
const { delay } = require('js-code-utils');
const integrations = {

}

parentPort.on('message', async job => {
  const { aggr, dataSource } = job;
  let key = `${aggr}_${dataSource}`;
  let toReturn = '';
  await delay(1000);
  if (integrations[key] && integrations[key].getData) {
    parentPort.postMessage(job);
  }
  else {
    parentPort.postMessage({
      error: true,
      err: new Error(`it was not found: ${JSON.stringify(job)}`)
    });
  }
});