const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");
// create a dynamic port. so at any given point, it might decide to deploy your app to port 3000 or 5000 or whatever it is on
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/2fa486ac68"
    const options = {
        method: "POST",
        auth: "wigarwijaya:4f68c4ced735e73b9a77b07cc5d57081-us18"
    }
    
    const request = https.request(url, options, (response) => {
        console.log(response.statusCode);
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
            // res.send("Successfully subscribed!");
        } else {
            res.sendFile(__dirname + "/failure.html");
            // res.send("There was an error with signing up, please try again!");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })

    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(port || 3000, () => {
  console.log(`App is running on port ${port}`);
});
 

// API Key
// 4f68c4ced735e73b9a77b07cc5d57081-us18
// newest
// ***DELETETHISf98677ad92bbee9bf60a2a76868df739-us18DELETETHIS***

// List ID
// 2fa486ac68

// const client = require("mailchimp-marketing");

// client.setConfig({
//   apiKey: "YOUR_API_KEY",
//   server: "YOUR_SERVER_PREFIX",
// });

// const run = async () => {
//   const response = await client.lists.batchListMembers("list_id", {
//     members: [{}],
//   });
//   console.log(response);
// };

// run();


