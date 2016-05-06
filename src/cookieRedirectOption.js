import {Cookie} from 'tough-cookie';

const cookieRedirectOption = (cookiesJar, res, options) => {
  let headerCookie = res.headers['set-cookie'];
  if (headerCookie) {
    console.log('set headerCookie=', headerCookie);
    let cookies = null;
    if (headerCookie instanceof Array) {
      cookies = headerCookie.map(Cookie.parse);
    } else {
      cookies = [Cookie.parse(headerCookie)];
    }
    cookies.forEach((cookie) => {
      cookiesJar.setCookieSync(cookie, options.url);
    });
    console.log('setCookieSync success');
  }
  let location = res.headers['location'];
  if (!location) {
    location = options.url;
  }
  let cookieString = cookiesJar.getCookieStringSync(location);
  if (cookieString) {
    let newOption = {...options};
    console.log('cookieString=', cookieString);
    newOption.headers = {...newOption.headers, Cookie:cookieString};
    return newOption;
  }
  return options;
};

export default cookieRedirectOption;