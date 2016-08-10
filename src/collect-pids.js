const requestPromise = require('./request-promise');
const fileSystem = require('./file-system');

async function init() {
    var brandPids = await getPids();
    return brandPids;
}

function getLadUrl(brand, numberOfPids = 2) {
    var url = `http://lad-api.net-a-porter.com:80/${brand}/GB/${numberOfPids}/0/pids?visibility=visible&whatsNew=Now`;
    console.log('Gettings pids from: ', url);
    return url;
}

async function getPids() {
    var numberOfPids = process.env.NUMBER_OF_PIDS;

    try {
        var brandPidsArr = await Promise.all([
            loadPids('NAP_LOCAL_PIDS', 'nap.json', 'TON', numberOfPids),
            loadPids('MRP_LOCAL_PIDS', 'mrp.json', 'MRP', numberOfPids),
            loadPids('TON_LOCAL_PIDS', 'ton.json', 'TON', numberOfPids)
        ]);
        return {
            nap: brandPidsArr[0],
            mrp: brandPidsArr[1],
            ton: brandPidsArr[2]
        };
    } catch (error) {
        console.error(error);
    }

}

async function loadPids(key, filename, brand, numberOfPids) {
    var pids;
    if (process.env[key]) {
        pids = fileSystem.loadPidsFromDisk(filename);
    } else {
        pids = await requestPromise(getLadUrl(brand, numberOfPids), true);
        pids = pids.body;
    }
    return pids;
}


module.exports = init;
