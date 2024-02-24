const { JSDOM } = require("jsdom");



function getURLsFromHTML(htmlBody, baseURL) {
  let urls = [];
  let dom = new JSDOM(htmlBody);
  let links = 
  dom.window.document.getElementsByTagName("a");
  for (let link of links) {
    if(link.href.slice(0,1)==='/'){
      try{
        let urlObj = new URL(`${baseURL}${link.href}`);
        urls.push(urlObj.href);
      }catch(err){
        console.log(`error with the url: ${err.message}`);
      }
    }else{
      try{
        let urlObj = new URL(link.href);
        urls.push(urlObj.href);
      }catch(err){
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
};
