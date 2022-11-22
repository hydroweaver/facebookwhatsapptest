require("dotenv").config();

const axios = require("axios");

const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.TAT,
  };

// let phones = [{'karan':'918800969419'}, {'Sree':'919148977521'}]
// let names = []

let phones = ['918800969419','919148977521']


phones.forEach(async function (number) {
  await axios({
    method: "post",
    url:
      "https://graph.facebook.com/v15.0/" +
      process.env.phone_number_id +
      "/messages/",
    headers,
    data: {
      messaging_product: "whatsapp",
      to: number,
      type: "template",
      template: {
        name: "sample_issue_resolution",
        language: {
          code: "en_US",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: "User",
              },
            ],
          },
        ],
      },
    },
  });
});
