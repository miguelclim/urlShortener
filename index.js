require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({extended:true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrls = []
const shortUrls = []

app.post('/api/shorturl', function (req, res) {
  const url = req.body.url
  const index = originalUrls.indexOf(url)

  if (!url.includes("https://") && !url.includes("http://")) {
    res.json({error:"invalid url"})
    return
  }

  if (index < 0) {
    originalUrls.push(url)
    shortUrls.push(shortUrls.length)
    
    res.json({ "original_url": url, "short_url": shortUrls.length-1 })
  }
  else{
    res.json({ "original_url": url, "short_url": shortUrls[index] })
  }
})

app.get('/api/shorturl/:shorturl', function (req, res){
  const url = parseInt(req.params.shorturl)
  const index = shortUrls.indexOf(url)

  if (index < 0) {
    res.json({ "error": "No short"})
    return
  }
  console.log(url);
  
  res.redirect(originalUrls[url])
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
