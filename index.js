require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let message_id_read = '';

app
  .get("/", (req, res) => {
    console.log(req.url);
    console.log(req.query["hub.challenge"]);
    console.log(req.query["hub.verify_token"]);
    res.send(req.query["hub.challenge"]);
  })
  .listen(3000, () => {
    console.log("Listening at 3000");
  });

const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + process.env.TAT,
};

// app.post("/", async (req, res) => {
//   console.log(req.body.entry[0].changes[0].value);
//   // console.log(req.body.entry[0].changes[0].value.messages[0].from);
//   if (
//     req.body.entry[0].changes[0].value &&
//     req.body.entry[0].changes[0].value.messages &&
//     req.body.entry[0].changes[0].value.messages[0].type == "text"
//   ) {
//     // console.log(req.body.entry[0].changes[0].value.messages[0].from);
//     console.log('------------------------------------------------------'+req.body.entry[0].changes[0].value.messages[0].text.body);
//     message_id_read = req.body.entry[0].changes[0].value.messages[0].id;
//     await axios({
//       method: "post",
//       url:
//         "https://graph.facebook.com/v15.0/" +
//         process.env.phone_number_id +
//         "/messages/",
//       headers,
//       data: {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to: req.body.entry[0].changes[0].value.messages[0].from,
//         type: "text",
//         text: {
//           body:
//             "Echo Message " +
//             req.body.entry[0].changes[0].value.messages[0].text.body,
//         },
//       },
//     });

//     // await axios({
//     //   method: "post",
//     //   url:
//     //     "https://graph.facebook.com/v15.0/" +
//     //     process.env.phone_number_id +
//     //     "/messages/",
//     //   headers,
//     //   data: {
//     //     messaging_product: "whatsapp",
//     //     message_id: message_id_read,
//     //     status: "read",
//     //   },
//     // });
//     // message_id_read = ''
//   } else {
//     console.log("Non handled chat action - Ignoring");
//   }
// });


app.post("/", async (req, res) => {
  console.log(req.body.entry[0].changes[0].value);
  // console.log(req.body.entry[0].changes[0].value.messages[0].from);
  if (
    req.body.entry &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0]
  ) {
    // console.log(req.body.entry[0].changes[0].value.messages[0].from);
    console.log('------------------------------------------------------'+req.body.entry[0].changes[0].value.messages[0].text.body);
    message_id_read = req.body.entry[0].changes[0].value.messages[0].id;
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
        to: req.body.entry[0].changes[0].value.messages[0].from,
        type: "text",
        text: {
          body:
            "Echo Message " +
            req.body.entry[0].changes[0].value.messages[0].text.body,
        },
      },
    });

    await axios({
      method: "post",
      url:
        "https://graph.facebook.com/v15.0/" +
        process.env.phone_number_id +
        "/messages/",
      headers,
      data: {
        messaging_product: "whatsapp",
        message_id: message_id_read,
        status: "read",
      },
    });
    message_id_read = ''
  } else {
    console.log("Non handled chat action - Ignoring");
  }
});