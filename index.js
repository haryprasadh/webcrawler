const { crawlPage } = require("./crawl.js");

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("too many commandLine arguments");
    process.exit(1);
  }

  let baseURL = process.argv[2];
  console.log(`starting to crawl on ${baseURL}`);
  let pages = await crawlPage(baseURL, baseURL, {});
  for (let page of Object.entries(pages)) {
    console.log(page);
  }
}

main();
