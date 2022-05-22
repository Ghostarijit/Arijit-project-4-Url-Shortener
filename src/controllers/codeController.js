
const urlModel = require("../models/urlModel")

//const authorModel = require("../models/authorModel");
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    14628,
  "redis-14628.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("tLbVn8IGvdFUd8sis3Jkfnl0LkhWk39D", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

redisClient.on("read", async function () {
    console.log("Connected to Redis and ready");
  });



//1. connect to the server
//2. use the commands :

//Connection setup for redis
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const urlCode = async (req, res) => {
    try {
      
        let Code=req.params.urlCode
        if(!Code){
          res.status(401).send({status:false,msg:"please provide UrlCode"})
        }
        let cahcedUrlCode = await GET_ASYNC(`${Code}`)   
        if(cahcedUrlCode) {
            let parsedUrlCode=JSON.parse(cahcedUrlCode)
            res.redirect(302, parsedUrlCode.longUrl)
        } else {
            let urlData = await urlModel.findOne({urlCode : Code}).select({longUrl:1,shortUrl:1,urlCode:1,_id:0});
            if(!urlData) return res.status(400).send({status: true, message: "Invalid Urlcode."})
            await SET_ASYNC(`${Code}`, JSON.stringify(urlData), "EX", 30)
            return res.redirect(302, urlData.longUrl)
        }
    }                                                       
                                             
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
}
module.exports.urlCode = urlCode