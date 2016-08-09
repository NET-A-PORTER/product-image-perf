const request = require("request");
const graph = require('./src/graph');
const requestPromise = require('./src/request-promise');

function getLadUrl(brand, numberOfPids = 2) {
    return `http://lad-api.net-a-porter.com:80/${brand}/GB/${numberOfPids}/0/pids?visibility=visible&whatsNew=Now`;
}

function generateCacheBuster() {
    var time = Math.round(new Date().getTime() / 1000).toString();
    var hash = Math.random().toString(10).substr(2);
    return [time, hash].join('_');
}

(async function() {
    var brandPids = await getPids();
    var performance = {
        nap: await getImagePerformanceAverages('net-a-porter', brandPids.nap.pids),
        mrp: await getImagePerformanceAverages('mrporter', brandPids.mrp.pids),
        ton: await getImagePerformanceAverages('theoutnet', brandPids.ton.pids)
    };
    graph(performance);
})();


async function getImagePerformanceAverages(brand, pids) {
    console.log('load', brand);
    var imagePerformance = [];
    var tempAverage = {
        origin: [],
        cache: []
    };

    for (let pid of pids) {
        var performance = await buildImagePerformanceObject(brand, pid);
        imagePerformance.push(performance);
        tempAverage.origin.push(performance.average.origin);
        tempAverage.cache.push(performance.average.cache);
    }

    return {
        pids: pids,
        imagePerformance: imagePerformance,
        average: {
            origin: average(tempAverage.origin),
            cache: average(tempAverage.cache)
        }
    };
}

async function getPids() {
    try {
        var brandPidsArr = await Promise.all([
            requestPromise(getLadUrl('NAP'), true),
            requestPromise(getLadUrl('MRP'), true),
            requestPromise(getLadUrl('TON'), true)
        ]);
        return {
            nap: brandPidsArr[0].body,
            mrp: brandPidsArr[1].body,
            ton: brandPidsArr[2].body
        };
    } catch (error) {
        console.error(error);
    }
}


async function buildImagePerformanceObject(brand, pid) {
    const numberOfTests = 10;
    var performanceObject = {
        origin: [],
        cache: [],
        average: {}
    };

    for (let i = 0; i < numberOfTests; i++) {
        var performance = await getImagePerformance(brand, pid);
        performanceObject.origin.push(performance.origin);
        performanceObject.cache.push(performance.cache);
    }

    performanceObject.average.origin = Math.round(average(performanceObject.origin));
    performanceObject.average.cache = Math.round(average(performanceObject.cache));

    return performanceObject;

}

function average(performanceArray) {
    return performanceArray.reduce(function(a, b) {
        return a + b;
    }) / performanceArray.length;
}

async function getImagePerformance(brand, pid) {
    var imageUrl = `http://cache.${brand}.com/images/products/${pid}/${pid}_in_m2.jpg`;
    var originUrl = [imageUrl, '?cachebuster=', generateCacheBuster()].join('')
    try {
        var performance = await Promise.all([
            requestPromise(originUrl, false, true),
            requestPromise(imageUrl, false, true)
        ]);
        return {
            origin: performance[0].elapsedTime,
            cache: performance[1].elapsedTime,
        };
    } catch (error) {
        console.error('The follow url was broken:', originUrl);
    }
}
