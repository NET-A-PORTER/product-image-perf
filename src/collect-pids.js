var requestPromise = require('./request-promise');

async function init() {
    var brandPids = await getPids();
    return brandPids;
}

function getLadUrl(brand, numberOfPids = 100) {
    return `http://lad-api.net-a-porter.com:80/${brand}/GB/${numberOfPids}/0/pids?visibility=visible&whatsNew=Now`;
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


module.exports = init;
