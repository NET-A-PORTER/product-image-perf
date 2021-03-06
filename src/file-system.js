const fs = require('fs');

const fileSystem = {
   saveBenchmarksToDisk(performanceMetrics) {
      const date = new Date()
                        .toISOString()
                        .replace(/T/, '_')
                        .replace(/\..+/, '')
                        .replace(/:/g, '-')
      const filename = `${date}.json`;
      const path = `./benchmarks/${filename}`;
      console.log('Writing performance benchmarks to disk: ', filename);
      fs.writeFileSync(path, JSON.stringify(performanceMetrics));
   },
   loadBenchmarksFromDisk(filename) {
      const path = `./benchmarks/${filename}`;
      console.log('Reading performance benchmarks from disk: ', filename);
      return JSON.parse(fs.readFileSync(path, {
         encoding: 'utf8'
      }));
   },
   loadPidsFromDisk(filename) {
      const path = `./pids/${filename}`;
      console.log('Reading pids from disk: ', filename);
      return JSON.parse(fs.readFileSync(path, {
         encoding: 'utf8'
      }));
   }
};

module.exports = {
   saveBenchmarksToDisk: fileSystem.saveBenchmarksToDisk,
   loadBenchmarksFromDisk:fileSystem.loadBenchmarksFromDisk,
   loadPidsFromDisk: fileSystem.loadPidsFromDisk
};
