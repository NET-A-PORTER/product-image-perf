const graph = require('./src/graph');
const requestPromise = require('./src/request-promise');
const collectPids = require('./src/collect-pids');
const getImagePerformanceAverages = require('./src/image-performance');
const fileSystem = require('./src/file-system');

var argv = require('minimist')(process.argv.slice(2));

(async function() {
    const benchMarkFilename = process.env.BENCHMARK_FILENAME;
    var performance;
    if (argv._.length > 0) {
        // If we have input arguments, we don't run tests for any brand by default
        performance = {
            nap: false,
            mrp: false,
            ton: false
        };
        for (let brand of argv._) {
            if (performance[brand] === false)
                performance[brand] = true;
        }
    } else {
        // No input arguments, so we run the tests for all brands
        performance = {
            nap: true,
            mrp: true,
            ton: true
        };
    }

    if (benchMarkFilename) {
        performance = fileSystem.loadBenchmarksFromDisk(benchMarkFilename);
    } else {
        var brandPids = await collectPids(Object.keys(performance).filter(function (brand) {
            return performance[brand] && brand
        }));
        performance = {
            nap: performance.nap && await getImagePerformanceAverages('net-a-porter', brandPids.nap.pids),
            mrp: performance.mrp && await getImagePerformanceAverages('mrporter', brandPids.mrp.pids),
            ton: performance.ton && await getImagePerformanceAverages('theoutnet', brandPids.ton.pids)
        }
        fileSystem.saveBenchmarksToDisk(performance);
    }
    ;

    graph(performance);
})();
