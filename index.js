const puppeteer = require('puppeteer');
const accountSid = process.env.TWILIO_AUTH_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.ticketmaster.fr/fr/manifestation/imagine-dragons-billet/idmanif/541006');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});


  setInterval(async () => {
      const texts = await page.$$eval('li.session-price-item', els => els.map(e => e.textContent));

      texts.forEach(text => {
          console.log(text)
          if (!text.includes('Épuisé')) {
              client.calls.create({
                url: "http://demo.twilio.com/docs/voice.xml",
                to: process.env.TWILIO_PHONE,
                from: "+15673132787",
              })
              .then(call => console.log(call.sid))
              .finally(() => {
                client.messages.create({
                    to: process.env.TWILIO_PHONE,
                    from: "+15673132787",
                    body: "Go ! Go ! => https://www.ticketmaster.fr/fr/manifestation/imagine-dragons-billet/idmanif/541006"
                })
              });
          } 
      })
      
      await page.setCacheEnabled(false);
      await page.reload({waitUntil: 'networkidle2'});

  }, 10000)

})();