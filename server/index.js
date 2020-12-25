const keys = require('./keys');
 
//PG
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('connect', () => {
    pgClient
      .query('CREATE TABLE IF NOT EXISTS values (number INT)')
      .catch((err) => console.log(err));
  });
pgClient.connect();

//REDIS CLIENT SETUP
const redis = require('redis');
const redisClient = redis.createClient({
        host: keys.redisHost,
        post: keys.redisPort,
        retry_strategy: ()=> 1000
});
const redisPublisher = redisClient.duplicate();

//Express route handlers
const express = require('express');
const bodyParser = require('body-parser');
const cors  = require('cors');
const app = express();
app.use(cors() );
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('Hi...');
});

app.get('/values/all', async (req,res)=>{
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
});

app.get('/values/current', async (req, res)=>{
    redisClient.hgetall('values',(err, values)=>{
        res.send(values);
    })
});

app.post('/values',async (req,res)=>{
    console.log(req.body);
    const index = req.body.index;
    console.log("posted value=="+index);
    if(index==undefined ){
        return res.status(422).send('invalid index');
    }
    if(index==undefined || parseInt(index)>40){
        return res.status(422).send('Index too high ');
    }

    redisClient.hset('values',index+'','Noting yet');

   // redisPublisher.publish('insert',index);
    redisPublisher.publish('insert',index+'');

    pgClient.query('INSERT INTO values(number) VALUES ($1)',[index]);
    res.send({working:true});
});

app.listen(5000, err => {
console.log('Listioning..');
});