const express = require("express");
const puppeteer = require("puppeteer"); // sadece bu yeterli

const app = express();

async function scrapeAltinFiyat(url, selector) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setUserAgent("Mozilla/5.0");
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitForSelector(selector);
  const fiyat = await page.$eval(selector, el => el.innerText.trim());

  await browser.close();

  return parseFloat(fiyat);
}

// 14 Ayar Altın
app.get("/api/14ayar", async (req, res) => {
  try {
    const fiyat = await scrapeAltinFiyat(
      "https://altin.in/fiyat/14-ayar-altin",
      'li[title="14 Ayar Altın - Satış"]'
    );
    res.json({ fiyat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 22 Ayar Bilezik
app.get("/api/22ayar", async (req, res) => {
  try {
    const fiyat = await scrapeAltinFiyat(
      "https://altin.in/fiyat/22-ayar-bilezik",
      'li[title="22 Ayar Bilezik - Satış"]'
    );
    res.json({ fiyat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 24 Ayar (Gram Altın)
app.get("/api/gram", async (req, res) => {
  try {
    const fiyat = await scrapeAltinFiyat(
      "https://altin.in/fiyat/gram-altin",
      'li[title="Gram Altın - Satış"]'
    );
    res.json({ fiyat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ONS Altın Fiyatı
app.get("/api/ons", async (req, res) => {
  try {
    const fiyat = await scrapeAltinFiyat(
      "https://altin.in", // Anasayfa
      '#ofiy' // ID ile ons altın fiyatı
    );
    res.json({ fiyat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dolar Fiyatı
app.get("/api/dolar", async (req, res) => {
  try {
    console.log('Executable path is:', puppeteer.executablePath());
    const fiyat = await scrapeAltinFiyat(
      "https://altin.in", // Anasayfa
      '#dfiy' // Dolar fiyatı
    );
    res.json({ fiyat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/euro", async (req, res) => {
  try {
    const fiyat = await scrapeAltinFiyat(
      "https://altin.in", // Anasayfa
      '#efiy' // Euro fiyatı
    );
    res.json({ fiyat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gümüş Fiyatı
app.get("/api/gumus", async (req, res) => {
  try {
    const fiyat = await scrapeAltinFiyat(
      "https://altin.in",
      '#gfiy'
    );
    res.json({ fiyat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cumhuriyet Altını
app.get("/api/cumhuriyet", async (req, res) => {
  try {
    const fiyat = await scrapeAltinFiyat(
      "https://altin.in/fiyat/cumhuriyet-altini",
      'li[title="Cumhuriyet Altını - Satış"]'
    );
    res.json({ fiyat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Ana endpoint
app.get("/", (req, res) => {
  res.send("Goldscraper API aktif. Uygun endpoint'ler:\n/api/14ayar\n/api/22ayar\n/api/gram\n/api/ons\n/api/dolar\n/api/euro\n/api/gumus\n/api/cumhuriyet");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`goldscraper API aktif: http://localhost:${port}`);
});
