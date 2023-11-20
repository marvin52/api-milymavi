const express = require("express");
const app = express();
var _request = require('request');
var _xml2js = require('xml2js').parseString;
const port = process.env.PORT || 3001;


function fetchFeed(url, cb){
    _request({
        url: url,
        headers: {
            'User-Agent': '	Mozilla/5.0 (Windows NT 10.0; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0'
        }
    }, function (error, response, xml){

        // valid response ?
        if (!error && response.statusCode == 200){
            // try to parse xml feed
            _xml2js(xml, function (xmlerror, xmldata){
                // error ?
                if (xmlerror){
                    cb(xmlerror, null);
                    return;
                }

                cb(null, xmldata);
            });
        }else{
            cb(error, null);
        }
    });
}


app.get('/podcasts', (req, res) => {

fetchFeed('https://feeds.soundcloud.com/users/soundcloud:users:1325580648/sounds.rss', function(err, data){
    if (err){
        console.error(err);
        return;
    }

    res.send(JSON.stringify(data));
});
  //res.send('Hello World!')
})

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;



