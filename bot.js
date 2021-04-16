const { Client } = require("whatsapp-web.js");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Console } = require("console");
const chalk = require("chalk");
const ora = require("ora");

const SESION = "./session.json";
let client;
let sesion_datos;

const sesionAbierta = () => {
  // Si archivo json con credes
  const spinner = ora(
    `Cargando ${chalk.yellow("verificando sesión wa.me...")}`
  );
  sesion_datos = require(SESION);
  spinner.start();
  client = new Client({ session: sesion_datos });
  client.on("ready", () => {
    console.log("cliente listo!!");
    spinner.stop();
    client.sendMessage("+527641195729@c.us", "Hola");
    //escuchaMensaje();
  });
  client.on("auth_failure", () => {
    spinner.stop();
    console.log("Error de Auth, borra session.json!");
  });
  client.initialize();
  escuchaMensaje();
};

// Para el QR
const sesionCerrada = () => {
  console.log("No hay sesión");
  client = new Client();
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });
  client.on("authenticated", (session) => {
    //guardar credenciales
    fs.writeFile(SESION, JSON.stringify(session), function (err) {
      if (err) {
        Console.log(err);
      }
    });
  });
  client.initialize();
};
const escuchaMensaje = () => {
  client.on("message", (msg) => {
    const { from, to, body } = msg;
    console.log(msg);
  });
};
const mandaMensaje = (to, msg) => {
  client.sendMessage(to, msg);
};
fs.existsSync(SESION) ? sesionAbierta() : sesionCerrada();
