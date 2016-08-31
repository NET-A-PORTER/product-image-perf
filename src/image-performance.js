var requestPromise = require('./request-promise');
var ProgressBar = require('progress');

const numberOfTests = process.env.NUMBER_OF_TESTS || 10;
var bar;

async function getImagePerformanceAverages(brand, pids) {
    bar = new ProgressBar(`Performance testing ${brand} [:bar] :percent :etas`, { width: 30, total: pids.length*numberOfTests })
    var imagePerformance = [];
    var tempAverage = {
        origin: [],
        cache: []
    };

    for (let pid of pids) {
        var performance = await _buildImagePerformanceObject(brand, pid);
        imagePerformance.push(performance);
        tempAverage.origin.push(performance.average.origin);
        tempAverage.cache.push(performance.average.cache);
    }

    return {
        pids: pids,
        imagePerformance: imagePerformance,
        average: {
            origin: _average(tempAverage.origin),
            cache: _average(tempAverage.cache)
        }
    };
}

async function _buildImagePerformanceObject(brand, pid) {
    
    var performanceObject = {
        origin: [],
        cache: [],
        average: {}
    };

    for (let i = 0; i < numberOfTests; i++) {
        var performance = await _getImagePerformance(brand, pid);
        performanceObject.origin.push(performance.origin);
        performanceObject.cache.push(performance.cache);
    }

    performanceObject.average.origin = Math.round(_average(performanceObject.origin));
    performanceObject.average.cache = Math.round(_average(performanceObject.cache));

    return performanceObject;

}

function _average(performanceArray) {
    return performanceArray.reduce(function(a, b) {
        return a + b;
    }) / performanceArray.length;
}

async function _getImagePerformance(brand, pid) {
    bar.tick();
    const imageUrl = `http://cache.${brand}.com/images/products/${pid}/${pid}_in_m2.jpg`;
    const originUrl = [imageUrl, '?cachebuster=', _generateCacheBuster()].join('')
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

// generate random param for cache busting image
function _generateCacheBuster() {
    var time = Math.round(new Date().getTime() / 1000).toString();
    var hash = Math.random().toString(10).substr(2);
    return [time, hash].join('_');
}

module.exports = getImagePerformanceAverages;
