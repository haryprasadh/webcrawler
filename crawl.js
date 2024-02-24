const { JSDOM } = require("jsdom");

async function crawlPage(baseURL,currentURL,pages) {

  let baseURLObj = new URL(baseURL);
  let currentURLObj = new URL(currentURL);
  if(baseURLObj.hostname!==currentURLObj.hostname)return pages;

  let normalizedCurrentURL = normalizeURL(currentURL);
  
  if(pages[normalizedCurrentURL]>0){
    pages[normalizedCurrentURL]++;
    return pages;
  }
  
  pages[normalizedCurrentURL]=1;
  console.log(`wait,currently crawling on ${currentURL}`);
  try{
    let res = await fetch(currentURL);
    if(res.status>399){
      console.log(`error in fetch with statuscode: ${res.status} on page ${currentURL}`);
      return pages;
    }
    if(!res.headers.get('content-type').includes('text/html')){
      console.log(`response is not html, it is ${res.headers.get('content-type')}, on page ${currentURL}`);
      return pages;
    }
    let htmlBody = await res.text();
    let nextUrls = getURLsFromHTML(htmlBody,baseURL);

    for(let nextUrl of nextUrls){
      pages = crawlPage(baseURL,nextUrl,pages);
    }
    
  }catch(err){
    console.log(`error in fetch: ${err.message} on page : ${currentURL}`);
  }
  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  let urls = [];
  let dom = new JSDOM(htmlBody);
  let links = dom.window.document.getElementsByTagName("a");
  for (let link of links) {
    if (link.href.slice(0, 1) === "/") {
      try {
        let urlObj = new URL(`${baseURL}${link.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with the url: ${err.message}`);
      }
    } else {
      try {
        let urlObj = new URL(link.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with the url: ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  let urlObj = new URL(urlString);
  let hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
