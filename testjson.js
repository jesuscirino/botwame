const fs = require("fs");
const d = "./data.json";
let sessionCfg;
if (fs.existsSync(d)) {
  sessionCfg = require(d);
}
console.log(sessionCfg);
