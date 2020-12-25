const keys = require('./keys');

const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: ()=>1000
});

const sub = redisClient.duplicate();
sub.on('message',(channel, message)=>{
    redisClient.hset('values',message, fib(parseInt(message)));
});

sub.subscribe('insert');

function fib(index){
    if (index < 2) return 2;
    return fib(index-2)+fib(index-2);
}


// const pub = redisClient.duplicate();
// redisClient.hset('values',4,'Noting yet');

// pub.publish('insert',4);