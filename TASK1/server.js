const express = require("express");
const fs = require("fs");
const app = express();

app.get("*", (req, res) => {
  var date = new Date();
  var ip = req.ip;
  var url = req.url;
  var protocol = req.protocol;
  var method = req.method;
  var hostname = req.hostname;

  console.log("A NEW REQUEST!");
  console.log(`TIMESTAMP:   ${date}`);
  console.log(`IP ADDRESS:  ${ip}`);
  console.log(`URL:         ${url}`);
  console.log(`PROTOCOL:    ${protocol}`);
  console.log(`HTTP METHOD: ${method}`);
  console.log(`HOSTNAME:    ${hostname}`);

  let data = {
    date: date,
    ip: ip,
    url: url,
    protocol: protocol,
    method: method,
    hostname: hostname,
  };

  const prevData = fs.readFileSync("requestslog.json");
  const myObj = JSON.parse(prevData);

  //   if (myObj.length == 0) {
  //   } else {
  myObj.push(data);
  var newData = JSON.stringify(myObj);
  fs.writeFile("requestslog.json", newData, (err) => {
    if (err) throw err;
    console.log("ALL GOOD!");
  });
  //   }
});

app.listen("3000", (err) => {
  console.log("Listening on port 3000!");
});
