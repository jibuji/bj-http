import {request} from './src';

//https://list.tmall.com/search_product.htm?q=good&type=p
let options = {
  // hostname: 'list.tmall.com',
  // path: '/search_product.htm?q=good&type=p',
  url: 'https://list.tmall.com/search_product.htm?q=good&type=p',
  method: 'GET',
  maxRedirects: 10,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'User-Agent': ' Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36',
    'Accept-Language': ' en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4'
  },
  onRedirect: (res, options) => {
    let location = res.headers['location'];
    let newOption = {...options, url:location};
    console.log("onRedirect to :", location);
    return newOption;
  }
};

request(options).then((res)=>{
  console.log('res.headers=', res.headers, ';res.body=', res.body);
});



