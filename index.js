const graph = require('./src/graph');
const requestPromise = require('./src/request-promise');
const collectPids = require('./src/collect-pids');
const getImagePerformanceAverages = require('./src/image-performance');
const fileSystem = require('./src/file-system');

(async function() {

    const benchMarkFilename = process.env.BENCHMARK_FILENAME;
    var performance;

    if (benchMarkFilename) {
        performance = fileSystem.loadBenchmarksFromDisk(benchMarkFilename);
    } else {
        var brandPids = await collectPids();
        performance = {
            nap: await getImagePerformanceAverages('net-a-porter', brandPids.nap.pids),
            mrp: await getImagePerformanceAverages('mrporter', brandPids.mrp.pids),
            ton: await getImagePerformanceAverages('theoutnet', brandPids.ton.pids)
        }
        fileSystem.saveBenchmarksToDisk(performance);
    };


    // load pids from file
    graph(performance);
})();
