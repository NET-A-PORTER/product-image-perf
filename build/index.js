'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = require('./src/graph');
var requestPromise = require('./src/request-promise');
var collectPids = require('./src/collect-pids');
var getImagePerformanceAverages = require('./src/image-performance');

(function _callee() {
    var brandPids, performance;
    return _regenerator2.default.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return _regenerator2.default.awrap(collectPids());

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

                    graph(performance);

                case 14:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, this);
})();