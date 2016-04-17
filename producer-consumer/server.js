var fivebeans = require('fivebeans'),
    lorem     = require('lorem-ipsum'),
    _         = require('lodash');

var hostname = _.head(
    _.compact([
        process.env.BEANSTALKD_PORT_11300_TCP_ADDR,
        process.env.BEANSTALKD_1_PORT_11300_TCP_ADDR,
        "beanstalkd"
    ])
);
console.log('connecting to', hostname);

var client = new fivebeans.client(hostname, 11300);
client
.on('connect', function(){
    client.use('default', function(err, tubename) {
        if (err) console.error('error using tube', err);
        else console.log('using tube', tubename);
    });

    // put new job every 10s
    setInterval(function () {
        client.put(100, 0, 60, lorem(), function(err, jobid) {
            if (err) console.error('error putting job', err);
            else console.log('put job', jobid);
        });
    }, (10*1000));

    // reserve job every 15s
    setInterval(function () {
        client.reserve(function(err, jobid, payload) {
            if (err) console.error('error reserving job', err);
            else console.log('reserved job', jobid);

            // randomly destroy or release given job
            if (Math.random() % 2) {
                client.destroy(jobid, function(err) {
                    if (err) console.error('error destroying job', jobid, err);
                    else console.log('destroyed job', jobid);
                });
            }
            else {
                client.release(jobid, 100, 0, function(err) {
                    if (err) console.error('error releasing job', jobid, err);
                    else console.log('released job', jobid);
                });
            }
        });
    }, (15*1000));
})
.on('error', function(err){
    console.error('error connecting', err);
    process.exit(1);
})
.on('close', function(){
    console.log('connection closed');
    process.exit();
})
.connect();
