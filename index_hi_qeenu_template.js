require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res)=>{
  res.send('Hello World!')
})

app
  .get("/webhook", (req, res) => {
    console.log(req.url);
    console.log(req.query["hub.challenge"]);
    console.log(req.query["hub.verify_token"]);
    res.send(req.query["hub.challenge"]);
  })
  .listen(process.env.PORT, () => {
    console.log(`Listening at ${process.env.PORT}`);
  });

const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + process.env.TAT,
};

app.post("/webhook", async (req, res) => {
  if(req.body.entry[0].changes[0].value.messages){
    console.log('-------->'+Date.now())
    console.log('------USER PRINT MESSAGE---------')
    console.log(req.body.entry[0].changes[0].value.messages)
  }
  else{
    console.log('-------->'+Date.now())
    console.log('------STATUS PRINT MESSAGE---------')
    console.log(req.body.entry[0].changes[0].value.statuses)
  }
  // res.sendStatus(200);
  if (
    req.body.entry &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0] &&
    req.body.entry[0].changes[0].value.messages[0].text &&
    req.body.entry[0].changes[0].value.messages[0].text.body &&
    req.body.entry[0].changes[0].value.messages[0].text.body == "Hi Qeenu!"
  ) {
  let incoming_phone = req.body.entry[0].changes[0].value.messages[0].from;
    await axios({
      method: "post",
      url:
        "https://graph.facebook.com/v15.0/" +
        process.env.phone_number_id +
        "/messages/",
      headers,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: incoming_phone,
        type: "template",
        "template": {
          "name": "hi_qeenu",
          "language": {
            "code": "en"
          },
          "components": [
            {
              "type": "header",
              "parameters": [
                {
                  "type": "image",
                  "image": {
                    "link": "https://www.qeenu.one/assets/Qeenu-logos/Qeenu-logos.jpeg"
                  }
                }
              ]
            },
            {
              "type": "body",
              "parameters": []
            },
          ]
        }
      },
    });
  } 
  
  if (
    req.body.entry &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0] &&
    req.body.entry[0].changes[0].value.messages[0].button &&
    req.body.entry[0].changes[0].value.messages[0].button.text == "Tell me more"
  ) {
  let incoming_phone = req.body.entry[0].changes[0].value.messages[0].from;
    await axios({
      method: "post",
      url:
        "https://graph.facebook.com/v15.0/" +
        process.env.phone_number_id +
        "/messages/",
      headers,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: incoming_phone,
        type: "text",
        text: {
          body:
            "Qeenu let's you upload your menu online instantly, you will get a webpage for your menu along with a QR code which links to your menu webpage."
          },
      },
    });
  }

  if (
    req.body.entry &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0] &&
    req.body.entry[0].changes[0].value.messages[0].button &&
    req.body.entry[0].changes[0].value.messages[0].button.text == "Stop promotions"
  ) {
  let incoming_phone = req.body.entry[0].changes[0].value.messages[0].from;
    await axios({
      method: "post",
      url:
        "https://graph.facebook.com/v15.0/" +
        process.env.phone_number_id +
        "/messages/",
      headers,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: incoming_phone,
        type: "text",
        text: {
          body:
            "Stop Promotions Handler"
          },
      },
    });
  }
  if(
    req.body.entry &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0] &&
    req.body.entry[0].changes[0].value.messages[0].button &&
    req.body.entry[0].changes[0].value.messages[0].button.text == 'https://www.qeenu.one/'
  )
  {
    let incoming_phone = req.body.entry[0].changes[0].value.messages[0].from;
    await axios({
      method: "post",
      url:
        "https://graph.facebook.com/v15.0/" +
        process.env.phone_number_id +
        "/messages/",
      headers,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: incoming_phone,
        type: "text",
        text: {
          body:
            "Go here: https://www.qeenu.one/"
          },
      },
    });
  }
  else {
    console.log("Sorry I might not have all the answers, visit https://www.qeenu.one/");
  }
  res.sendStatus(200); // <-- THIS HAS CHANGED EVERYTHING, IT DOES NOT SEND USELESS MESSAGES BACK TO ME ANYMORE!
  // https://stackoverflow.com/questions/72894209/whatsapp-cloud-api-sending-old-message-inbound-notification-multiple-time-on-my
});