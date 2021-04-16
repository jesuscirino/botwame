const fs = require("fs");
let datos = fs.readFileSync("datos.txt", "utf-8").split("\n");
datos = datos.map((el) => el.replace("\r", ""));
console.log(datos);
