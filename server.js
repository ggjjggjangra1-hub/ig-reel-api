const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

const PORT = process.env.PORT || 10000;

// CORS allow
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req,res)=>{
  res.send("IG Reel API Running");
});

app.get("/views", async (req,res)=>{
  try{
    const url = req.query.url;
    if(!url) return res.status(400).json({error:"Missing url"});

    const browser = await puppeteer.launch({
      headless:true,
      args:["--no-sandbox","--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(url,{waitUntil:"networkidle2",timeout:0});

    const html = await page.content();

    const match = html.match(/view_count[^0-9]*([0-9]+)/i);
    const views = match ? match[1] : "Not Found";

    await browser.close();

    res.json({
      views: views,
      updated: new Date().toLocaleTimeString()
    });

  }catch(e){
    res.status(500).json({views:"Error",updated:"Failed"});
  }
});

app.listen(PORT, ()=>console.log("Running on "+PORT));
