const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the wrapper page at /
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Casino Proxy Wrapper</title>
<style>
  html, body { margin:0; padding:0; height:100%; overflow:hidden; }
  iframe { width:100%; height:100%; border:none; }
</style>
</head>
<body>
<iframe src="/proxy/" id="casinoFrame"></iframe>
</body>
</html>
  `);
});

// Proxy route
app.get("/proxy/*", async (req, res) => {
  try {
    const targetUrl = "https://casino.click" + req.path.replace("/proxy", "");
    const response = await fetch(targetUrl);
    let body = await response.text();

    // Rewrite links to stay inside the proxy
    body = body.replace(/href="(\/[^"]*)"/g, 'href="/proxy$1" target="_self"');
    body = body.replace(/target="_blank"/g, 'target="_self"');

    res.send(body);
  } catch (err) {
    res.status(500).send("Error fetching page: " + err.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
