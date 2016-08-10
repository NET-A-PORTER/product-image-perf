var requestPromise = require('./request-promise');

async function init() {
    var brandPids = await getPids();
    return brandPids;
}

function getLadUrl(brand, numberOfPids = 100) {
    var url = `http://lad-api.net-a-porter.com:80/${brand}/GB/${numberOfPids}/0/pids?visibility=visible&whatsNew=Now`;
    console.log('Gettings pids from: ', url);
    return url;
}

async function getPids() {
    var numberOfPids = process.env.NUMBER_OF_PIDS;
    try {
        var brandPidsArr = await Promise.all([
            requestPromise(getLadUrl('NAP', numberOfPids), true),
            requestPromise(getLadUrl('MRP', numberOfPids), true),
            requestPromise(getLadUrl('TON', numberOfPids), true)
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


module.exports = init;
