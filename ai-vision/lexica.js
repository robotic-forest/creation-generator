const request = require('request-promise-native')
const cloudflareScraper = require('cloudflare-scraper');

// puppeteer not working on WSL, could try on my linux machine
// for now, wait for API

// const url = 'https://lexica.art/?q=art'
const url = 'https://image.lexica.art/sm/24ffd878-5cfa-42bf-93c8-2e5e6b122f0f'

const puppeteer = require('puppeteer');

async function startBrowser(){
	let browser;
	try {
	    console.log("Opening the browser......");
	    browser = await puppeteer.launch({
	        headless: false,
	        // args: ["--disable-setuid-sandbox"],
	        // 'ignoreHTTPSErrors': true,
          executablePath: "/bin/google-chrome"
	    });
	} catch (err) {
	    console.log("Could not create a browser instance => : ", err);
	}
	return browser;
}

const lexica = async () => {
  // let browserInstance = await  startBrowser()
  const browser = await puppeteer.launch({ executablePath: "/bin/google-chrome" })
  console.log({ browse })
}

module.exports = {
  lexica
}
