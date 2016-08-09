const request = require("request");

module.exports = function requestPromise(url, json, time) {
    json = json || false;
    time = time || false;
    return new Promise(function(resolve, reject) {
        request({
            url: url,
            json: json,
            time: time
        }, function(err, res) {
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
};
