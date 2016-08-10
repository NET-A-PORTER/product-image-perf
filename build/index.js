'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = require('./src/graph');
var requestPromise = require('./src/request-promise');
var collectPids = require('./src/collect-pids');
var getImagePerformanceAverages = require('./src/image-performance');
var fileSystem = require('./src/file-system');

(function _callee() {
    var benchMarkFilename, performance, brandPids;
    return _regenerator2.default.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    benchMarkFilename = process.env.BENCHMARK_FILENAME;

                    if (!benchMarkFilename) {
                        _context.next = 5;
                        break;
                    }

                    performance = fileSystem.loadBenchmarksFromDisk(benchMarkFilename);
                    _context.next = 19;
                    break;

                case 5:
                    _context.next = 7;
                    return _regenerator2.default.awrap(collectPids());

                case 7:
                    brandPids = _context.sent;
                    _context.next = 10;
                    return _regenerator2.default.awrap(getImagePerformanceAverages('net-a-porter', brandPids.nap.pids));

                case 10:
                    _context.t0 = _context.sent;
                    _context.next = 13;
                    return _regenerator2.default.awrap(getImagePerformanceAverages('mrporter', brandPids.mrp.pids));

                case 13:
                    _context.t1 = _context.sent;
                    _context.next = 16;
                    return _regenerator2.default.awrap(getImagePerformanceAverages('theoutnet', brandPids.ton.pids));

                case 16:
                    _context.t2 = _context.sent;
                    performance = {
                        nap: _context.t0,
                        mrp: _context.t1,
                        ton: _context.t2
                    };

                    fileSystem.saveBenchmarksToDisk(performance);

                case 19:
                    ;

                    // load pids from file
                    graph(performance);

                case 21:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, this);
})();