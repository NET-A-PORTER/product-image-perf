const blessed = require('blessed');
const contrib = require('blessed-contrib');

var colors = ['yellow', 'cyan', 'magenta', 'red', 'green', 'blue', 'white'];

function init(metrics) {
    // set up dashboard
    const screen = blessed.screen();
    const grid = new contrib.grid({
        rows: 2,
        cols: 1,
        screen: screen
    });

    // Line graph for images
    const line = grid.set(0, 0, 1, 1, contrib.line, {
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

    let dataPoints = [];
    let titles = [];
    let data = [];
    for (let brand of Object.keys(metrics)) {
        if (metrics[brand] !== false) {
            dataPoints.push(
                _generateOptionsForLineOnGraph(brand.toUpperCase() + ' cache', metrics[brand].imagePerformance, 'cache', colors.pop()),
                _generateOptionsForLineOnGraph(brand.toUpperCase() + ' origin', metrics[brand].imagePerformance, 'origin', colors.pop())
            );
            titles.push(brand.toUpperCase() + ' cache', brand.toUpperCase() + ' origin');
            data.push(metrics[brand].average.cache, metrics[brand].average.origin);
        }
    }

    line.setData(dataPoints);

    // Bar graph for brands
    const bar = grid.set(1, 0, 1, 1, contrib.bar, {
        label: 'Brand average',
        barWidth: 15,
        barSpacing: 4,
        xOffset: 0,
        maxHeight: 9
   });

    bar.setData({
        titles: titles,
        data: data
    });

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        return process.exit(0);
    });
    screen.render();
}


function _generateOptionsForLineOnGraph(title, metrics, origin, colour) {
    return {
        title: title,
        x: Array.apply(null, {
            length: metrics.length
        }).map(Number.call, Number),
        y: _generateLineGraphYAxis(metrics, origin),
        style: {
            line: colour
        }
    };
}

function _generateLineGraphYAxis(imagePerformance, key) {
    return imagePerformance.map((image) => {
        return image.average[key];
    });
}

module.exports = init;
