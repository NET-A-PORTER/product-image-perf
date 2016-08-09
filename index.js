const graph = require('./src/graph');
const requestPromise = require('./src/request-promise');
const collectPids = require('./src/collect-pids');
const getImagePerformanceAverages = require('./src/image-performance');

(async function() {
    var brandPids = await collectPids();
    var performance = {
        nap: await getImagePerformanceAverages('net-a-porter', brandPids.nap.pids),
        mrp: await getImagePerformanceAverages('mrporter', brandPids.mrp.pids),
        ton: await getImagePerformanceAverages('theoutnet', brandPids.ton.pids)
    };
    graph(performance);
})();
