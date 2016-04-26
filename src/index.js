import https from 'https';
import url from 'url';
import iconv from 'iconv-lite';

const httpsPromise = (options) => {
  return new Promise(function(resolve, reject) { 
    let urlParts = url.parse(options.url);
    options.hostname = urlParts.hostname;
    options.path = urlParts.path;
    console.log('options=', options);
    var req = https.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

      res.setEncoding('binary');
      let buffers = [], size = 0;

      res.on('data', (chunk) => {
        console.log('type of chunk=', Buffer.isBuffer(chunk));
        buffers.push(new Buffer(chunk, 'binary'));
        size += chunk.length;
        // console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
        let buffer = new Buffer(size), pos = 0;
        for(let i = 0, l = buffers.length; i < l; i++) {
            buffers[i].copy(buffer, pos);
            pos += buffers[i].length;
        }
        let str = iconv.decode(buffer, 'GBK');
        res.body = str;
        resolve(res);
      })
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`, e);
      reject(e);
    });

    req.end();
  });
};

const request = async (options) => {
  let maxRedirects = options.maxRedirects;
  for(;--maxRedirects >= 0;) {
    let res = await httpsPromise(options);
    if (res.statusCode == 302) {
      options = options.onRedirect(res, options);
      if (options != null) {
        continue
      }
    }
    return res;
  }
  console.log('exceed maxRedirects.');
  return null;
};

export  {request};


