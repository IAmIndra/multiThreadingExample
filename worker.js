require('module-alias/register');
const { WorkerData, parentPort } = require('worker_threads');
const integrations = {
  'Datacap_api': { getData: false },
  'NMI_api': { getData: true },
  'Authnet_api': { getData: true },
  'Goldstar_api': { getData: true }
};

parentPort.on('message', async job => {
  const { aggr, dataSource } = job;
  let key = `${aggr}_${dataSource}`;
  let toReturn = '';
  await delay(1000);
  if (integrations[key] && integrations[key].getData) {
    parentPort.postMessage(job);
  } else throw new Error(`it was not found: ${JSON.stringify(job)}`);
});

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
