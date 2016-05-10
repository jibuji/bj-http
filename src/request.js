import https from 'https';
import http from 'http';
import url from 'url';
import iconv from 'iconv-lite';

const httpsPromise = (options) => {
  return new Promise(function(resolve, reject) { 
    let urlParts = url.parse(options.url);
    // console.log('urlParts: ', urlParts);
    options.hostname = urlParts.hostname;
    options.path = urlParts.path;
    // console.log('options=', options);
    let client = https;
    if (urlParts.protocol === 'http:') {
      client = http;
    }
    var req = client.request(options, (res) => {
      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

      res.setEncoding('binary');
      let buffers = [], size = 0;

      res.on('data', (chunk) => {
        // console.log('type of chunk=', Buffer.isBuffer(chunk));
        buffers.push(new Buffer(chunk, 'binary'));
        size += chunk.length;
        // console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        // console.log('No more data in response.');
        let buffer = new Buffer(size), pos = 0;
        for(let i = 0, l = buffers.length; i < l; i++) {
            buffers[i].copy(buffer, pos);
            pos += buffers[i].length;
        }
        let encoding = 'utf8';
        let contentType = res.headers['Content-Type'] || res.headers['content-type'];
        if (contentType && contentType.match(/gbk/i)) {
          encoding = 'GBK';
        }
        // console.log('response encoding=', encoding);
        let str = iconv.decode(buffer, encoding);
        res.body = str;
        resolve(res);
      })
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`, e);
      reject(e);
    });
    
    let postData = options.postData;
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const request = async (options) => {
  if (!options.onEveryResponse) {
    options.onEveryResponse = (res, options) => {
     return null;
    }
  }
  for(;;) {
    let res = await httpsPromise(options);
    options = options.onEveryResponse(res, options);
    if (options != null) {
      continue;
    }
    return res;
  }
  console.log('exceed maxRedirects.');
  return null;
};

export default request;

