const blessed = require('blessed');
const contrib = require('blessed-contrib');

function init(metrics) {
    const screen = blessed.screen();
    const grid = new contrib.grid({
        rows: 2,
        cols: 1,
        screen: screen
    });

    var line = grid.set(0, 0, 1, 1, contrib.line, {
        style: {
            line: "yellow",
            text: "green",
            baseline: "black"
        },
        xLabelPadding: 3,
        xPadding: 5,
        label: 'Images average',
        showLegend: true
    });

    // http://unix.stackexchange.com/questions/105568/how-can-i-list-the-available-color-names
    var lineData = [
        generateOptionsForLineOnGraph('NAP cache', metrics.nap.imagePerformance, 'cache', 'magenta'),
        generateOptionsForLineOnGraph('NAP origin', metrics.nap.imagePerformance, 'origin', 'red'),
        generateOptionsForLineOnGraph('MRP cache', metrics.mrp.imagePerformance, 'cache', 'cyan'),
        generateOptionsForLineOnGraph('MRP origin', metrics.mrp.imagePerformance, 'origin', 'blue'),
        generateOptionsForLineOnGraph('TON cache', metrics.ton.imagePerformance, 'cache', 'white'),
        generateOptionsForLineOnGraph('TON origin', metrics.ton.imagePerformance, 'origin', 'yellow')
    ];

    line.setData(lineData);

    var bar = grid.set(1, 0, 1, 1, contrib.bar, {
        label: 'Brand average',
        barWidth: 15,
        barSpacing: 4,
        xOffset: 0,
        maxHeight: 9
   });

    bar.setData({
        titles: [
            'NAP cache',
            'NAP origin',
            'MRP cache',
            'MRP origin',
            'TON cache',
            'TON origin'
        ],
        data: [
            metrics.nap.average.cache,
            metrics.nap.average.origin,
            metrics.mrp.average.cache,
            metrics.mrp.average.origin,
            metrics.ton.average.cache,
            metrics.ton.average.origin
        ]
    });

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        return process.exit(0);
    });
    screen.render();
}


function generateOptionsForLineOnGraph(title, metrics, origin, colour) {
    return {
        title: title,
        x: Array.apply(null, {
            length: metrics.length
        }).map(Number.call, Number),
        y: generateLineGraphYAxis(metrics, origin),
        style: {
            line: colour
        }
    };
}

function generateLineGraphYAxis(imagePerformance, key) {
    return imagePerformance.map((image) => {
        return image.average[key];
    });
}

module.exports = init;
