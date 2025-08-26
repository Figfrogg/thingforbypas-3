const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static wrapper page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/wrapper.html");
});

// Proxy route to fetch casino.click pages
app.get("/proxy/*", async (req, res) => {
  try {
    const targetUrl = "https://casino.click" + req.path.replace("/proxy", "");
    const response = await fetch(targetUrl);
    let body = await response.text();

    // Rewrite links to go through proxy
    body = body.replace(/href="(\/[^"]*)"/g, 'href="/proxy$1" target="_self"');
    body = body.replace(/target="_blank"/g, 'target="_self"');

    res.send(body);
  } catch (err) {
    res.status(500).send("Error fetching page: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
