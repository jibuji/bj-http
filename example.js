import {request, cookieRedirectOption} from './src';
import tough from 'tough-cookie';

let CookieJar = tough.CookieJar;
let cookiesJar = new CookieJar();
//https://list.tmall.com/search_product.htm?q=good&type=p
let options = {
  // hostname: 'list.tmall.com',
  // path: '/search_product.htm?q=good&type=p',
  url: 'https://list.tmall.com/search_product.htm?q=good&type=p',
  method: 'GET',
  maxRedirects: 5,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'User-Agent': ' Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36',
    'Accept-Language': ' en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4'
  },
  onEveryResponse: (res, options) => {
    if (res.statusCode == 302) {
      try {
        let newOption = cookieRedirectOption(cookiesJar, res, options);
        let location = res.headers['location'];
        newOption = {...newOption, url:location};
        console.log("onRedirect to :", location);
        return newOption;
      } catch (e) {
        console.log('onRedirect error happened. e=', e);
      }
    }
  }
};

request(options).then((res)=>{
  console.log('res.headers=', res.headers);
});



