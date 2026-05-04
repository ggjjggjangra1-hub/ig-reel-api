const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

const PORT = process.env.PORT || 10000;

app.use((req,res,next)=>{
res.header("Access-Control-Allow-Origin","*");
next();
});

app.get("/views", async (req,res)=>{

try{

const url = req.query.url;

const browser = await puppeteer.launch({
headless:true,
args:["--no-sandbox","--disable-setuid-sandbox"]
});

const page = await browser.newPage();

await page.setUserAgent(
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
);

await page.goto(url,{waitUntil:"domcontentloaded",timeout:60000});

await page.waitForTimeout(4000);

const html = await page.content();

let match = html.match(/view_count[^0-9]*([0-9]+)/i);

if(!match){
match = html.match(/video_view_count[^0-9]*([0-9]+)/i);
}

const views = match ? match[1] : "Not Found";

await browser.close();

res.json({
views: views,
updated: new Date().toLocaleTimeString()
});

}catch(e){

res.json({
views:"Failed",
updated:"Try Public Reel"
});

}

});

app.listen(PORT);
