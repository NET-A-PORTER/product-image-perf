const requestPromise = require('./request-promise');
const fileSystem = require('./file-system');

async function init() {
    return await _getPids();
}

function getLadUrl(brand, numberOfPids = 100) {
    var url;
    if(process.env.RANDOM_PIDS) {
        url = _generateRandomLadUrl(brand, numberOfPids);
    } else {
        url = `http://lad-api.net-a-porter.com:80/${brand}/GB/${numberOfPids}/0/pids?visibility=visible&whatsNew=Now`;
    }
    console.log('Gettings pids from: ', url);
    return url;
}

function _generateRandomLadUrl(brand, numberOfPids) {
    // should really see how many products there are first, but this is a guess there will never be less than 2000;
    const offset = Math.floor(Math.random() * 1900);
    const sortArr = [
        'discount',
        'price-asc',
        'price-desc',
        'new-in'
    ];
    const sort = sortArr[Math.floor(Math.random() * 4)];
    return `http://lad-api.net-a-porter.com:80/${brand}/GB/${numberOfPids}/${offset}/pids?visibility=visible&sort=${sort}`;
}

async function _getPids() {
    const numberOfPids = process.env.NUMBER_OF_PIDS;

    try {
        const brandPidsArr = await Promise.all([
            _loadPids('NAP_LOCAL_PIDS', 'nap.json', 'NAP', numberOfPids),
            _loadPids('MRP_LOCAL_PIDS', 'mrp.json', 'MRP', numberOfPids),
            _loadPids('TON_LOCAL_PIDS', 'ton.json', 'TON', numberOfPids)
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

async function _loadPids(key, filename, brand, numberOfPids) {
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
