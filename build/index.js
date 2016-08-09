"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require("request");
var path = require('path');

function getLadUrl(brand) {
    var numberOfPids = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

    return "http://lad-api.net-a-porter.com:80/" + brand + "/GB/" + numberOfPids + "/0/pids?visibility=visible&whatsNew=Now";
}

function requestPromise(url, json, time) {
    json = json || false;
    time = time || false;
    return new Promise(function (resolve, reject) {
        request({ url: url, json: json, time: time }, function (err, res) {
            if (err) {
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code: " + res.statusCode);
                err.res = res;
                return reject(err);
            }
            resolve(res);
        });
    });
}

function generateCacheBuster() {
    var time = Math.round(new Date().getTime() / 1000).toString();
    var hash = Math.random().toString(10).substr(2);
    return [time, hash].join('_');
}

(function _callee() {
    var brandPids, performance;
    return _regenerator2.default.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return _regenerator2.default.awrap(getPids());

                case 2:
                    brandPids = _context.sent;
                    _context.next = 5;
                    return _regenerator2.default.awrap(getImagePerformanceAverages('net-a-porter', brandPids.nap.pids));

                case 5:
                    _context.t0 = _context.sent;
                    _context.next = 8;
                    return _regenerator2.default.awrap(getImagePerformanceAverages('mrporter', brandPids.mrp.pids));

                case 8:
                    _context.t1 = _context.sent;
                    _context.next = 11;
                    return _regenerator2.default.awrap(getImagePerformanceAverages('theoutnet', brandPids.ton.pids));

                case 11:
                    _context.t2 = _context.sent;
                    performance = {
                        nap: _context.t0,
                        mrp: _context.t1,
                        ton: _context.t2
                    };

                    console.log('performance');
                    console.log(performance);

                case 15:
                case "end":
                    return _context.stop();
            }
        }
    }, null, this);
})();

function getImagePerformanceAverages(brand, pids) {
    var imagePerformance, tempAverage, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pid, performance;

    return _regenerator2.default.async(function getImagePerformanceAverages$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    console.log('load', brand);
                    imagePerformance = [];
                    tempAverage = {
                        origin: [],
                        cache: []
                    };
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context2.prev = 6;
                    _iterator = pids[Symbol.iterator]();

                case 8:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _context2.next = 19;
                        break;
                    }

                    pid = _step.value;
                    _context2.next = 12;
                    return _regenerator2.default.awrap(buildImagePerformanceObject(brand, pid));

                case 12:
                    performance = _context2.sent;

                    imagePerformance.push(performance);
                    tempAverage.origin.push(performance.average.origin);
                    tempAverage.cache.push(performance.average.cache);

                case 16:
                    _iteratorNormalCompletion = true;
                    _context2.next = 8;
                    break;

                case 19:
                    _context2.next = 25;
                    break;

                case 21:
                    _context2.prev = 21;
                    _context2.t0 = _context2["catch"](6);
                    _didIteratorError = true;
                    _iteratorError = _context2.t0;

                case 25:
                    _context2.prev = 25;
                    _context2.prev = 26;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }

                case 28:
                    _context2.prev = 28;

                    if (!_didIteratorError) {
                        _context2.next = 31;
                        break;
                    }

                    throw _iteratorError;

                case 31:
                    return _context2.finish(28);

                case 32:
                    return _context2.finish(25);

                case 33:
                    return _context2.abrupt("return", {
                        pids: pids,
                        imagePerformance: imagePerformance,
                        average: {
                            origin: average(tempAverage.origin),
                            cache: average(tempAverage.cache)
                        }
                    });

                case 34:
                case "end":
                    return _context2.stop();
            }
        }
    }, null, this, [[6, 21, 25, 33], [26,, 28, 32]]);
}

function getPids() {
    var brandPidsArr;
    return _regenerator2.default.async(function getPids$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.prev = 0;
                    _context3.next = 3;
                    return _regenerator2.default.awrap(Promise.all([requestPromise(getLadUrl('NAP'), true), requestPromise(getLadUrl('MRP'), true), requestPromise(getLadUrl('TON'), true)]));

                case 3:
                    brandPidsArr = _context3.sent;
                    return _context3.abrupt("return", {
                        nap: brandPidsArr[0].body,
                        mrp: brandPidsArr[1].body,
                        ton: brandPidsArr[2].body
                    });

                case 7:
                    _context3.prev = 7;
                    _context3.t0 = _context3["catch"](0);

                    console.error(_context3.t0);

                case 10:
                case "end":
                    return _context3.stop();
            }
        }
    }, null, this, [[0, 7]]);
}

function buildImagePerformanceObject(brand, pid) {
    var numberOfTests, performanceObject, i, performance;
    return _regenerator2.default.async(function buildImagePerformanceObject$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    numberOfTests = 10;
                    performanceObject = {
                        origin: [],
                        cache: [],
                        average: {}
                    };
                    i = 0;

                case 3:
                    if (!(i < numberOfTests)) {
                        _context4.next = 12;
                        break;
                    }

                    _context4.next = 6;
                    return _regenerator2.default.awrap(getImagePerformance(brand, pid));

                case 6:
                    performance = _context4.sent;

                    performanceObject.origin.push(performance.origin);
                    performanceObject.cache.push(performance.cache);

                case 9:
                    i++;
                    _context4.next = 3;
                    break;

                case 12:

                    performanceObject.average.origin = Math.round(average(performanceObject.origin));
                    performanceObject.average.cache = Math.round(average(performanceObject.cache));

                    return _context4.abrupt("return", performanceObject);

                case 15:
                case "end":
                    return _context4.stop();
            }
        }
    }, null, this);
}

function average(performanceArray) {
    return performanceArray.reduce(function (a, b) {
        return a + b;
    }) / performanceArray.length;
}

function getImagePerformance(brand, pid) {
    var imageUrl, originUrl, performance;
    return _regenerator2.default.async(function getImagePerformance$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    imageUrl = "http://cache." + brand + ".com/images/products/" + pid + "/" + pid + "_in_m2.jpg";
                    originUrl = [imageUrl, '?cachebuster=', generateCacheBuster()].join('');
                    _context5.prev = 2;
                    _context5.next = 5;
                    return _regenerator2.default.awrap(Promise.all([requestPromise(originUrl, false, true), requestPromise(imageUrl, false, true)]));

                case 5:
                    performance = _context5.sent;
                    return _context5.abrupt("return", {
                        origin: performance[0].elapsedTime,
                        cache: performance[1].elapsedTime
                    });

                case 9:
                    _context5.prev = 9;
                    _context5.t0 = _context5["catch"](2);

                    console.error('The follow url was broken:', originUrl);

                case 12:
                case "end":
                    return _context5.stop();
            }
        }
    }, null, this, [[2, 9]]);
}